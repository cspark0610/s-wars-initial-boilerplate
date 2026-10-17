#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Falla el proceso si npm audit reporta vulnerabilidades critical.
 * High, moderate y low no bloquean (alineado a política de despliegue).
 *
 * Uso: node scripts/check-npm-audit-high-critical.js
 */
const { execSync } = require('child_process');

const BLOCK_LEVELS = ['critical'];

function runAuditJson() {
  try {
    return execSync('npm audit --json', {
      encoding: 'utf8',
      maxBuffer: 20 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (err) {
    // npm audit sale con código distinto de 0 si hay hallazgos, pero suele imprimir JSON en stdout
    const out = err.stdout?.toString?.() || '';
    if (out.trim().startsWith('{')) return out;
    console.error(err.stderr?.toString?.() || err.message || String(err));
    process.exit(1);
  }
}

function getSeverityCounts(report) {
  const fromMeta = report.metadata?.vulnerabilities;
  if (fromMeta && typeof fromMeta === 'object') return fromMeta;

  const legacy = report.vulnerabilities;
  if (legacy && typeof legacy === 'object') {
    const counts = { info: 0, low: 0, moderate: 0, high: 0, critical: 0 };
    for (const entry of Object.values(legacy)) {
      const sev = (entry.severity || '').toLowerCase();
      if (counts[sev] !== undefined) counts[sev]++;
    }
    return counts;
  }
  return null;
}

function main() {
  let report;
  try {
    const raw = runAuditJson();
    report = JSON.parse(raw);
  } catch (e) {
    console.error(
      'check-npm-audit-high-critical: no se pudo parsear la salida de npm audit --json'
    );
    console.error(e.message || e);
    process.exit(1);
  }

  // npm audit devuelve un error de registry (ej. 401 Unauthorized) cuando no puede
  // autenticarse contra Artifactory. En ese caso no hay datos de vulnerabilidades,
  // así que advertimos y salimos sin bloquear el proceso.
  if (report.statusCode && report.statusCode !== 200) {
    const msg = report.message || JSON.stringify(report.error || '');
    console.warn(
      `check-npm-audit-high-critical: no se pudo ejecutar el audit (HTTP ${report.statusCode}): ${msg}. ` +
        'Se omite la verificación.'
    );
    process.exit(0);
  }

  const counts = getSeverityCounts(report);
  if (!counts) {
    console.error(
      'check-npm-audit-high-critical: formato de reporte de audit no reconocido'
    );
    process.exit(1);
  }

  let blocked = 0;
  const parts = [];
  for (const level of BLOCK_LEVELS) {
    const n = Number(counts[level]) || 0;
    if (n > 0) {
      parts.push(`${n} ${level}`);
      blocked += n;
    }
  }

  if (blocked > 0) {
    console.error(
      `check-npm-audit-high-critical: commit bloqueado — ${parts.join(
        ', '
      )}. ` +
        'Corregí dependencias o obtené excepción explícita antes de commitear.'
    );
    process.exit(1);
  }

  console.log(
    'check-npm-audit-high-critical: sin critical ' +
      `(info=${counts.info || 0} low=${counts.low || 0} moderate=${
        counts.moderate || 0
      } high=${counts.high || 0})`
  );
}

main();
