import { Injectable } from '@nestjs/common';

@Injectable()
export class AllotmentsService {
  private allotments: any[] = [];

  calculateMeritScore(application: any) {
    const academic = application.academicPercentage ?? 66;
    const entranceScore = application.entranceScore ?? 78;
    const weighted = academic * 0.7 + entranceScore * 0.3;

    return {
      applicationId: application.id,
      score: Number(weighted.toFixed(2)),
      breakdown: {
        academic,
        entranceScore,
        weighted,
      },
    };
  }

  generateRound(applicants: any[]) {
    const ranked = [...applicants]
      .map((app) => ({
        ...app,
        ...this.calculateMeritScore(app),
      }))
      .sort((a, b) => b.score - a.score);

    const allocations = ranked.slice(0, 5).map((app, index) => ({
      id: `allo_${Date.now()}_${index}`,
      applicationId: app.id,
      rank: index + 1,
      status: 'ALLOTTED',
      seat: `SEAT-${index + 1}`,
    }));

    this.allotments.push(...allocations);
    return allocations;
  }
}
