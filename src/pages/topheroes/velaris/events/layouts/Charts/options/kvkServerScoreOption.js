// 2. Fix kvkServerScoreOption.js  
import { computed } from 'vue'

export function useServerScoreOption(servers) {
    return computed(() => {
        if (!servers.value || servers.value.length === 0) {
            return {
                title: {
                    text: 'No Server Data Available',
                    left: 'center',
                    top: 'middle',
                    textStyle: {
                        color: '#6b7280',
                        fontSize: 16
                    }
                }
            }
        }

        // Use reliable colors
        const winnerColor = '#10b981'  // Green
        const loserColor = '#ef4444'   // Red

        const serverData = servers.value.map((server, index) => ({
            name: server.serverName,
            value: server.totalScore,
            itemStyle: {
                color: index === 0 ? winnerColor : loserColor
            }
        }))

        return {
            title: {
                text: 'Server Battle Results',
                left: 'center',
                top: '5%',
                textStyle: {
                    fontSize: 18,
                    fontWeight: 'bold'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c:,} ({d}%)',
            },
            legend: {
                orient: 'horizontal',
                bottom: '10%',
            },
            series: [
                {
                    type: 'pie',
                    radius: ['30%', '70%'],
                    center: ['50%', '50%'],
                    data: serverData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    label: {
                        show: true,
                        formatter: '{b}\n{c:,}',
                        fontSize: 12,
                        fontWeight: 'bold'
                    },
                    labelLine: {
                        show: true,
                    }
                }
            ],
            graphic: {
                type: 'text',
                left: 'center',
                top: 'center',
                style: {
                    text: servers.value[0]?.serverName + '\nWINS!',
                    textAlign: 'center',
                    fill: winnerColor,
                    fontSize: 16,
                    fontWeight: 'bold'
                }
            }
        }
    })
}