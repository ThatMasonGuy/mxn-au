// functions/generateRankingsReport.mjs - Fixed version with better error handling
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/v2';
import { db } from '../config/firebase.mjs';

export const generateRankingsReport = onCall(
  {
    timeoutSeconds: 540, // 9 minutes max
    memory: '2GiB', // Increased memory
    region: 'australia-southeast2',
    maxInstances: 1
  },
  async (request) => {
    const startTime = Date.now();
    let reportId = null;

    try {
      const { auth, data } = request;

      // Ensure user is authenticated
      if (!auth) {
        throw new HttpsError('unauthenticated', 'Must be authenticated to generate reports');
      }

      reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      logger.info(`Starting rankings report generation: ${reportId}`, {
        userId: auth.uid,
        userName: data?.userName || auth.email
      });

      // Create audit log entry with better error handling
      try {
        await db.collection('topheroes/velaris/audit').add({
          reportId,
          action: 'generate_rankings_report',
          userId: auth.uid,
          userName: data?.userName || auth.email || 'Unknown',
          timestamp: new Date(),
          status: 'started'
        });
      } catch (auditError) {
        logger.warn('Failed to create audit log entry:', auditError);
        // Don't fail the whole operation for audit log issues
      }

      // Load all members data with error handling
      logger.info('Loading members data...');
      const membersSnapshot = await db.collection('topheroes/velaris/members').get();

      if (membersSnapshot.empty) {
        throw new HttpsError('failed-precondition', 'No members data found');
      }

      const membersData = [];
      const memberEvents = {};

      logger.info(`Processing ${membersSnapshot.docs.length} members`);

      // Process each member and their events with better error handling
      for (const memberDoc of membersSnapshot.docs) {
        try {
          const memberData = {
            id: memberDoc.id,
            ...memberDoc.data()
          };

          // Ensure required fields exist
          memberData.power = memberData.power || 0;
          memberData.status = memberData.status || 'unknown';
          memberData.name = memberData.name || memberData.id;

          // Calculate growth metrics with better error handling
          if (memberData.history && Array.isArray(memberData.history) && memberData.history.length > 0) {
            try {
              const sortedHistory = [...memberData.history]
                .filter(h => h && (h.date || h.power !== undefined)) // Filter out invalid entries
                .sort((a, b) => {
                  const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
                  const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
                  return dateA - dateB;
                });

              if (sortedHistory.length > 0) {
                memberData.earliestPower = sortedHistory[0].power || 0;
                memberData.latestPower = sortedHistory[sortedHistory.length - 1].power || memberData.power || 0;
                memberData.powerGrowth = memberData.latestPower - memberData.earliestPower;
                memberData.powerGrowthPercent = memberData.earliestPower > 0
                  ? ((memberData.powerGrowth / memberData.earliestPower) * 100).toFixed(1)
                  : 0;
              } else {
                // Fallback if no valid history
                memberData.earliestPower = memberData.power || 0;
                memberData.latestPower = memberData.power || 0;
                memberData.powerGrowth = 0;
                memberData.powerGrowthPercent = 0;
              }
            } catch (historyError) {
              logger.warn(`Error processing history for member ${memberDoc.id}:`, historyError);
              // Set fallback values
              memberData.earliestPower = memberData.power || 0;
              memberData.latestPower = memberData.power || 0;
              memberData.powerGrowth = 0;
              memberData.powerGrowthPercent = 0;
            }
          } else {
            memberData.earliestPower = memberData.power || 0;
            memberData.latestPower = memberData.power || 0;
            memberData.powerGrowth = 0;
            memberData.powerGrowthPercent = 0;
          }

          // Load member's events with error handling
          try {
            const eventsSnapshot = await db
              .collection(`topheroes/velaris/members/${memberDoc.id}/events`)
              .get();

            const events = eventsSnapshot.docs.map(doc => {
              const eventData = doc.data();
              return {
                id: doc.id,
                ...eventData,
                // Ensure numeric fields are numbers
                scoreD1: Number(eventData.scoreD1) || 0,
                scoreD2: Number(eventData.scoreD2) || 0,
                scoreD3: Number(eventData.scoreD3) || 0,
                scoreD4: Number(eventData.scoreD4) || 0,
                scoreD5: Number(eventData.scoreD5) || 0,
                scoreD6: Number(eventData.scoreD6) || 0,
              };
            });

            memberEvents[memberDoc.id] = events;
          } catch (eventError) {
            logger.warn(`Error loading events for member ${memberDoc.id}:`, eventError);
            memberEvents[memberDoc.id] = [];
          }

          membersData.push(memberData);
        } catch (memberError) {
          logger.warn(`Error processing member ${memberDoc.id}:`, memberError);
          // Continue with other members
        }
      }

      if (membersData.length === 0) {
        throw new HttpsError('failed-precondition', 'No valid members data could be processed');
      }

      // Load GvG events catalog with error handling
      logger.info('Loading GvG events...');
      let gvgEvents = [];
      try {
        const gvgSnapshot = await db
          .collection('topheroes/velaris/events')
          .where('type', '==', 'GvG')
          .get();

        gvgEvents = gvgSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (gvgError) {
        logger.warn('Error loading GvG events:', gvgError);
        // Continue without GvG events
      }

      logger.info(`Processing events for ${membersData.length} members with ${gvgEvents.length} GvG events`);

      // Calculate aggregated stats for each member
      const processedMembers = membersData.map(member => {
        try {
          const events = memberEvents[member.id] || [];

          // GvG-only events for this member
          const memberGvgEvents = events.filter(e => {
            const eventData = gvgEvents.find(gvg => gvg.id === e.eventId);
            return eventData?.type === 'GvG';
          });

          // Calculate totals with safe math
          const totalGvGScore = memberGvgEvents.reduce((sum, event) => {
            const eventScore = (event.scoreD1 || 0) + (event.scoreD2 || 0) +
              (event.scoreD3 || 0) + (event.scoreD4 || 0) +
              (event.scoreD5 || 0) + (event.scoreD6 || 0);
            return sum + eventScore;
          }, 0);

          const gvgAvgScore = memberGvgEvents.length > 0 ? Math.round(totalGvGScore / memberGvgEvents.length) : 0;

          const totalEventScore = events.reduce((sum, event) => {
            const eventScore = (event.scoreD1 || 0) + (event.scoreD2 || 0) +
              (event.scoreD3 || 0) + (event.scoreD4 || 0) +
              (event.scoreD5 || 0) + (event.scoreD6 || 0);
            return sum + eventScore;
          }, 0);

          // Performance by day
          const dayPerformance = { D1: 0, D2: 0, D3: 0, D4: 0, D5: 0, D6: 0 };
          events.forEach(event => {
            dayPerformance.D1 += event.scoreD1 || 0;
            dayPerformance.D2 += event.scoreD2 || 0;
            dayPerformance.D3 += event.scoreD3 || 0;
            dayPerformance.D4 += event.scoreD4 || 0;
            dayPerformance.D5 += event.scoreD5 || 0;
            dayPerformance.D6 += event.scoreD6 || 0;
          });

          const bestDay = Object.entries(dayPerformance).reduce(
            (best, [day, score]) => (score > best.score ? { day, score } : best),
            { day: 'D1', score: 0 }
          );

          // Participation rate with safe division
          const participationRate = gvgEvents.length > 0
            ? Math.round((memberGvgEvents.length / gvgEvents.length) * 100)
            : 0;

          const avgEventScore = events.length > 0 ? totalEventScore / events.length : 0;

          const activityScore = Math.round(
            (participationRate * 0.3) + (Math.min(avgEventScore / 10000, 100) * 0.7)
          );

          const contributionScore = Math.round(
            (totalEventScore / 1_000_000) +
            ((member.powerGrowth || 0) / 1_000_000) +
            (participationRate * 2)
          );

          return {
            ...member,
            totalEventScore,
            totalGvGScore,
            gvgAvgScore,
            dayPerformance,
            bestDay: bestDay.day,
            bestDayScore: bestDay.score,
            eventCount: events.length,
            gvgCount: memberGvgEvents.length,
            participationRate,
            activityScore,
            contributionScore,
            avgEventScore: Math.round(avgEventScore)
          };
        } catch (processingError) {
          logger.warn(`Error processing member stats for ${member.id}:`, processingError);
          // Return member with default values
          return {
            ...member,
            totalEventScore: 0,
            totalGvGScore: 0,
            gvgAvgScore: 0,
            dayPerformance: { D1: 0, D2: 0, D3: 0, D4: 0, D5: 0, D6: 0 },
            bestDay: 'D1',
            bestDayScore: 0,
            eventCount: 0,
            gvgCount: 0,
            participationRate: 0,
            activityScore: 0,
            contributionScore: 0,
            avgEventScore: 0
          };
        }
      });

      // Generate all rankings with error handling
      const currentMembers = processedMembers.filter(m => m.status === 'active' || m.status === 'inactive');

      const rankings = {
        power: processedMembers
          .filter(m => m.status === 'active')
          .sort((a, b) => (b.power || 0) - (a.power || 0))
          .map((m, i) => ({ ...m, rank: i + 1, change: 0 })),

        growth: processedMembers
          .filter(m => m.status === 'active' && m.powerGrowth !== undefined)
          .sort((a, b) => (b.powerGrowth || 0) - (a.powerGrowth || 0))
          .map((m, i) => ({ ...m, rank: i + 1, change: 0 })),

        activity: processedMembers
          .filter(m => m.status === 'active')
          .sort((a, b) => (b.activityScore || 0) - (a.activityScore || 0))
          .map((m, i) => ({ ...m, rank: i + 1, change: 0 })),

        gvg: processedMembers
          .filter(m => m.status === 'active')
          .sort((a, b) => (b.totalGvGScore || 0) - (a.totalGvGScore || 0))
          .map((m, i) => ({ ...m, rank: i + 1, change: 0 })),

        gvgAverage: processedMembers
          .filter(m => m.status === 'active')
          .filter(m => (m.gvgCount || 0) > 0)
          .sort((a, b) => (b.gvgAvgScore || 0) - (a.gvgAvgScore || 0))
          .map((m, i) => ({ ...m, rank: i + 1, change: 0 })),

        contribution: processedMembers
          .filter(m => m.status === 'active')
          .sort((a, b) => (b.contributionScore || 0) - (a.contributionScore || 0))
          .map((m, i) => ({ ...m, rank: i + 1, change: 0 }))
      };

      // Generate day rankings
      const dayRankings = {};
      const days = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'];
      days.forEach(day => {
        dayRankings[day] = processedMembers
          .filter(m => m.status === 'active' && m.dayPerformance && m.dayPerformance[day] > 0)
          .sort((a, b) => (b.dayPerformance[day] || 0) - (a.dayPerformance[day] || 0))
          .slice(0, 10)
          .map((member, index) => ({
            ...member,
            rank: index + 1,
            score: member.dayPerformance[day]
          }));
      });

      // Generate insights and stats
      const guildStats = {
        totalMembers: processedMembers.length,
        currentMembers: currentMembers.length,
        totalPower: currentMembers.reduce((sum, m) => sum + (m.power || 0), 0),
        avgPower: currentMembers.length > 0 ? Math.round(currentMembers.reduce((sum, m) => sum + (m.power || 0), 0) / currentMembers.length) : 0,
        totalGrowth: currentMembers.reduce((sum, m) => sum + (m.powerGrowth || 0), 0),
        avgActivity: currentMembers.length > 0 ? Math.round((currentMembers.reduce((sum, m) => sum + (m.activityScore || 0), 0) / currentMembers.length) * 10) : 0,
        participationRate: currentMembers.length > 0 ? Math.round(currentMembers.reduce((sum, m) => sum + (m.participationRate || 0), 0) / currentMembers.length) : 0
      };

      guildStats.growthPercent = guildStats.totalPower > 0 ? ((guildStats.totalGrowth / guildStats.totalPower) * 100).toFixed(1) : '0.0';

      // Generate weekly heroes with safe access
      const weeklyHeroes = [];
      try {
        if (rankings.growth.length > 0 && rankings.growth[0].powerGrowth > 0) {
          weeklyHeroes.push({
            id: rankings.growth[0].id,
            name: rankings.growth[0].name,
            achievement: `Biggest Growth +${rankings.growth[0].powerGrowthPercent}%`
          });
        }
        if (rankings.activity.length > 0 && rankings.activity[0].activityScore > 0) {
          weeklyHeroes.push({
            id: rankings.activity[0].id,
            name: rankings.activity[0].name,
            achievement: `Most Active (${rankings.activity[0].participationRate}% participation)`
          });
        }
        if (rankings.gvg.length > 0 && rankings.gvg[0].totalGvGScore > 0) {
          const formatNumber = (num) => {
            if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
            if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
            return num.toString();
          };
          weeklyHeroes.push({
            id: rankings.gvg[0].id,
            name: rankings.gvg[0].name,
            achievement: `GvG Champion (${formatNumber(rankings.gvg[0].totalGvGScore)} pts)`
          });
        }
        if (rankings.contribution.length > 0) {
          weeklyHeroes.push({
            id: rankings.contribution[0].id,
            name: rankings.contribution[0].name,
            achievement: 'Top Contributor'
          });
        }
      } catch (heroError) {
        logger.warn('Error generating weekly heroes:', heroError);
      }

      const endTime = Date.now();
      const processingTime = endTime - startTime;

      // Create the report document
      const report = {
        id: reportId,
        createdAt: new Date(),
        createdBy: {
          userId: auth.uid,
          userName: data?.userName || auth.email || 'Unknown'
        },
        processingTimeMs: processingTime,
        dataVersion: '1.1', // Increment version
        rankings,
        dayRankings,
        guildStats,
        weeklyHeroes,
        insights: [], // You can add insights generation logic here
        metadata: {
          totalMembers: processedMembers.length,
          activeMembersProcessed: rankings.power.length,
          gvgEventsCount: gvgEvents.length,
          processingDuration: `${Math.round(processingTime / 1000)}s`,
          errors: [] // Could track non-fatal errors here
        }
      };

      // Save the report with retry logic
      let saveSuccess = false;
      let saveAttempts = 0;
      const maxSaveAttempts = 3;

      while (!saveSuccess && saveAttempts < maxSaveAttempts) {
        try {
          await db.collection('topheroes/velaris/reports').doc(reportId).set(report);
          saveSuccess = true;
        } catch (saveError) {
          saveAttempts++;
          logger.warn(`Failed to save report (attempt ${saveAttempts}):`, saveError);
          if (saveAttempts >= maxSaveAttempts) {
            throw saveError;
          }
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * saveAttempts));
        }
      }

      // Update audit log
      try {
        await db.collection('topheroes/velaris/audit').add({
          reportId,
          action: 'generate_rankings_report',
          userId: auth.uid,
          userName: data?.userName || auth.email || 'Unknown',
          timestamp: new Date(),
          status: 'completed',
          processingTimeMs: processingTime,
          totalMembers: processedMembers.length
        });
      } catch (auditError) {
        logger.warn('Failed to create completion audit log:', auditError);
        // Don't fail the operation for audit issues
      }

      logger.info(`Rankings report generated successfully: ${reportId}`, {
        processingTime: `${Math.round(processingTime / 1000)}s`,
        totalMembers: processedMembers.length,
        activeMembers: rankings.power.length
      });

      return {
        success: true,
        reportId,
        processingTime,
        metadata: report.metadata,
        message: `Report generated in ${Math.round(processingTime / 1000)} seconds`
      };

    } catch (error) {
      logger.error('Failed to generate rankings report', {
        error: error.message,
        stack: error.stack,
        reportId
      });

      // Log failure in audit
      try {
        await db.collection('topheroes/velaris/audit').add({
          reportId: reportId || 'unknown',
          action: 'generate_rankings_report',
          userId: request.auth?.uid || 'unknown',
          userName: request.data?.userName || 'Unknown',
          timestamp: new Date(),
          status: 'failed',
          error: error.message,
          processingTimeMs: Date.now() - startTime
        });
      } catch (auditError) {
        logger.error('Failed to log audit entry', auditError);
      }

      // Map specific errors to user-friendly messages
      if (error.code) {
        throw error; // Already an HttpsError
      } else if (error.message?.includes('timeout')) {
        throw new HttpsError('deadline-exceeded', 'Report generation timed out. Please try again.');
      } else if (error.message?.includes('permission')) {
        throw new HttpsError('permission-denied', 'Insufficient permissions to generate report.');
      } else {
        throw new HttpsError('internal', `Failed to generate report: ${error.message}`);
      }
    }
  }
);