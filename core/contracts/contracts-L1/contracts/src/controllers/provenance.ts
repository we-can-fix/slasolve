import { Request, Response } from 'express';
import { ProvenanceService } from '../services/provenance';
import { createError } from '../middleware/error';

export class ProvenanceController {
  private provenanceService: ProvenanceService;

  constructor() {
    this.provenanceService = new ProvenanceService();
  }

  /**
   * 創建構建認證
   */
  createAttestation = async (req: Request, res: Response): Promise<void> => {
    try {
      const { subjectPath, builder, metadata } = req.body;

      if (!subjectPath || !builder) {
        throw createError.validation('Subject path and builder information are required');
      }

      const attestation = await this.provenanceService.createBuildAttestation(
        subjectPath,
        builder,
        metadata
      );

      res.status(201).json({
        success: true,
        data: {
          attestation,
          export: this.provenanceService.exportAttestation(attestation)
        },
        message: 'Build attestation created successfully'
      });
    } catch (error) {
      if (error instanceof Error) {
        throw createError.internal(error.message);
      }
      throw createError.internal('Failed to create attestation');
    }
  };

  /**
   * 驗證認證
   */
  verifyAttestation = async (req: Request, res: Response): Promise<void> => {
    try {
      const { attestation } = req.body;

      if (!attestation) {
        throw createError.validation('Attestation data is required');
      }

      const isValid = await this.provenanceService.verifyAttestation(attestation);

      res.json({
        success: true,
        data: {
          valid: isValid,
          attestationId: attestation.id,
          timestamp: new Date().toISOString()
        },
        message: isValid ? 'Attestation is valid' : 'Attestation is invalid'
      });
    } catch (error) {
      if (error instanceof Error) {
        throw createError.internal(error.message);
      }
      throw createError.internal('Failed to verify attestation');
    }
  };

  /**
   * 獲取文件摘要
   */
  getFileDigest = async (req: Request, res: Response): Promise<void> => {
    try {
      const { filePath } = req.params;

      if (!filePath) {
        throw createError.validation('File path is required');
      }

      const digest = await this.provenanceService.generateFileDigest(filePath);

      res.json({
        success: true,
        data: {
          filePath,
          digest,
          timestamp: new Date().toISOString()
        },
        message: 'File digest generated successfully'
      });
    } catch (error) {
      if (error instanceof Error) {
        throw createError.internal(error.message);
      }
      throw createError.internal('Failed to generate file digest');
    }
  };

  /**
   * 導入認證
   */
  importAttestation = async (req: Request, res: Response): Promise<void> => {
    try {
      const { jsonData } = req.body;

      if (!jsonData) {
        throw createError.validation('JSON data is required');
      }

      const attestation = this.provenanceService.importAttestation(jsonData);
      const isValid = await this.provenanceService.verifyAttestation(attestation);

      res.json({
        success: true,
        data: {
          attestation,
          valid: isValid,
          timestamp: new Date().toISOString()
        },
        message: 'Attestation imported successfully'
      });
    } catch (error) {
      if (error instanceof Error) {
        throw createError.validation(error.message);
      }
      throw createError.validation('Invalid JSON data or attestation format');
    }
  };
}