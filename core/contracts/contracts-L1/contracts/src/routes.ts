import { Router } from 'express';
import { Request, Response } from 'express';
import { ProvenanceController } from './controllers/provenance';
import { SLSAController } from './controllers/slsa';

const router = Router();
const provenanceController = new ProvenanceController();
const slsaController = new SLSAController();

// 健康檢查端點
router.get('/healthz', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'contracts-l1'
  });
});

router.get('/readyz', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ready',
    timestamp: new Date().toISOString(),
    checks: {}
  });
});

router.get('/version', (_req: Request, res: Response) => {
  res.json({
    version: process.env.npm_package_version || '1.0.0',
    build: process.env.BUILD_SHA || 'local',
    timestamp: new Date().toISOString()
  });
});

router.get('/status', (_req: Request, res: Response) => {
  res.json({
    service: 'contracts-l1',
    status: 'running',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// 溯源認證端點
router.post('/api/v1/provenance/attestations', provenanceController.createAttestation);
router.post('/api/v1/provenance/attest', provenanceController.createAttestation); // Alias for tests
router.post('/api/v1/provenance/verify', provenanceController.verifyAttestation);
router.post('/api/v1/provenance/import', provenanceController.importAttestation);
router.post('/api/v1/provenance/digest', provenanceController.getFileDigest); // POST for tests
router.get('/api/v1/provenance/digest/:filePath(*)', provenanceController.getFileDigest);
router.get('/api/v1/provenance/export/:id', provenanceController.exportAttestation);


// SLSA 認證端點
router.post('/api/v1/slsa/attestations', slsaController.createAttestation);
router.post('/api/v1/slsa/verify', slsaController.verifyAttestation);
router.post('/api/v1/slsa/digest', slsaController.generateDigest);
router.post('/api/v1/slsa/contracts', slsaController.createContractAttestation);
router.post('/api/v1/slsa/summary', slsaController.getAttestationSummary);

// 根端點
router.get('/', (_req: Request, res: Response) => {
  res.json({
    service: 'contracts-l1',
    version: '1.0.0',
    description: 'SLASolve Contracts L1 - Core contract management service with build provenance',
    endpoints: {
      health: '/healthz',
      ready: '/readyz',
      version: '/version',
      status: '/status',
      provenance: {
        createAttestation: 'POST /api/v1/provenance/attestations',
        verifyAttestation: 'POST /api/v1/provenance/verify',
        importAttestation: 'POST /api/v1/provenance/import',
        getFileDigest: 'GET /api/v1/provenance/digest/{filePath}',
        exportAttestation: 'GET /api/v1/provenance/export/{id}'
      },
      slsa: {
        createAttestation: 'POST /api/v1/slsa/attestations',
        verifyAttestation: 'POST /api/v1/slsa/verify',
        generateDigest: 'POST /api/v1/slsa/digest',
        contractAttestation: 'POST /api/v1/slsa/contracts',
        summary: 'POST /api/v1/slsa/summary'
      }
    }
  });
});

export default router;