// Trend Weaver Module - Market & Design Insights
class TrendWeaver {
    constructor() {
        this.currentTrends = null;
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        const generateBtn = document.getElementById('generate-trends');
        if (generateBtn) generateBtn.addEventListener('click', () => this.generateTrends());
    }

    async generateTrends() {
        const categorySelect = document.getElementById('trend-category');
        const category = categorySelect ? categorySelect.value : 'fashion';

        try {
            this.showStatus('Analyzing trends...', 'info');

            // For demo purposes, simulate trend generation
            // In production, this would call your backend API
            setTimeout(() => {
                this.currentTrends = this.generateMockTrends(category);
                this.displayTrends(this.currentTrends);
                this.showStatus('Trends generated successfully!', 'success');
            }, 2000);

        } catch (error) {
            console.error('Error generating trends:', error);
            this.showStatus('Error generating trends. Please try again.', 'error');
        }
    }

    generateMockTrends(category) {
        const trendData = {
            fashion: {
                colors: [
                    { name: 'Sage Green', hex: '#A8B5A0', description: 'Calming and sustainable' },
                    { name: 'Warm Terracotta', hex: '#D2691E', description: 'Earthy and grounding' },
                    { name: 'Soft Lavender', hex: '#E6E6FA', description: 'Gentle and sophisticated' },
                    { name: 'Deep Indigo', hex: '#4B0082', description: 'Rich and versatile' }
                ],
                designs: [
                    'Sustainable fabrics with natural textures',
                    'Layered silhouettes with fluid movement',
                    'Handcrafted details and artisanal elements',
                    'Cultural fusion patterns and motifs'
                ],
                market: [
                    'Growing demand for ethical fashion in Indian markets',
                    'Rise of slow fashion movement with traditional Indian textiles',
                    'Increased interest in cultural storytelling through Indian motifs',
                    'Premium pricing for authentic Indian craftsmanship and handloom products'
                ]
            },
            'home': {
                colors: [
                    { name: 'Warm Beige', hex: '#F5F5DC', description: 'Cozy and inviting' },
                    { name: 'Forest Green', hex: '#228B22', description: 'Natural and calming' },
                    { name: 'Clay Brown', hex: '#CD853F', description: 'Rustic and warm' },
                    { name: 'Soft Blue', hex: '#87CEEB', description: 'Peaceful and serene' }
                ],
                designs: [
                    'Biophilic design with natural elements',
                    'Multifunctional spaces with hidden storage',
                    'Handcrafted furniture with organic shapes',
                    'Sustainable materials and eco-friendly finishes'
                ],
                market: [
                    'Focus on wellness and mental health spaces in Indian homes',
                    'Demand for sustainable home products made from Indian materials',
                    'Interest in cultural and heritage-inspired Indian decor',
                    'Smart home integration with traditional Indian aesthetics'
                ]
            },
            'art': {
                colors: [
                    { name: 'Burnt Sienna', hex: '#E97451', description: 'Passionate and dynamic' },
                    { name: 'Ultramarine Blue', hex: '#4169E1', description: 'Deep and expressive' },
                    { name: 'Golden Yellow', hex: '#FFD700', description: 'Energetic and warm' },
                    { name: 'Crimson Red', hex: '#DC143C', description: 'Bold and striking' }
                ],
                designs: [
                    'Mixed media and experimental techniques',
                    'Cultural narratives and storytelling',
                    'Digital-physical art hybrids',
                    'Sustainable art materials and practices'
                ],
                market: [
                    'Growing NFT and digital art market in India',
                    'Interest in cultural preservation through Indian art forms',
                    'Rise of socially conscious art movements in Indian context',
                    'Demand for accessible art education in Indian languages'
                ]
            }
        };

        return trendData[category] || trendData.fashion;
    }

    displayTrends(trends) {
        this.displayColorTrends(trends.colors);
        this.displayDesignTrends(trends.designs);
        this.displayMarketTrends(trends.market);
    }

    displayColorTrends(colors) {
        const colorPalette = document.getElementById('color-palette');
        if (!colorPalette) return;

        colorPalette.innerHTML = '';

        colors.forEach(color => {
            const colorDiv = document.createElement('div');
            colorDiv.className = 'color-item';
            colorDiv.innerHTML = `
                <div class="color-swatch" style="background-color: ${color.hex}"></div>
                <div class="color-info">
                    <h4>${color.name}</h4>
                    <p>${color.description}</p>
                    <code>${color.hex}</code>
                </div>
            `;
            colorPalette.appendChild(colorDiv);
        });
    }

    displayDesignTrends(designs) {
        const designInsights = document.getElementById('design-insights');
        if (!designInsights) return;

        designInsights.innerHTML = '';

        designs.forEach(design => {
            const designItem = document.createElement('div');
            designItem.className = 'trend-item';
            designItem.innerHTML = `
                <div class="trend-icon">🎨</div>
                <p>${design}</p>
            `;
            designInsights.appendChild(designItem);
        });
    }

    displayMarketTrends(marketInsights) {
        const marketInsightsDiv = document.getElementById('market-insights');
        if (!marketInsightsDiv) return;

        marketInsightsDiv.innerHTML = '';

        marketInsights.forEach(insight => {
            const insightItem = document.createElement('div');
            insightItem.className = 'trend-item';
            insightItem.innerHTML = `
                <div class="trend-icon">📈</div>
                <p>${insight}</p>
            `;
            marketInsightsDiv.appendChild(insightItem);
        });
    }

    showStatus(message, type = 'info') {
        // Create or find status element in trend dashboard
        let statusDiv = document.querySelector('#trend-dashboard .status');
        if (!statusDiv) {
            statusDiv = document.createElement('div');
            statusDiv.className = 'status';
            const dashboard = document.getElementById('trend-dashboard');
            if (dashboard) {
                dashboard.insertBefore(statusDiv, dashboard.firstChild);
            }
        }

        if (statusDiv) {
            statusDiv.textContent = message;
            statusDiv.className = `status status-${type}`;
        }
    }
}

// Initialize Trend Weaver when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('trend-weaver-screen')) {
        new TrendWeaver();
    }
});
