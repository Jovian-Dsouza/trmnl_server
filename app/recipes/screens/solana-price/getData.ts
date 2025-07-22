import { unstable_cache } from "next/cache";

// Export config to mark this component as dynamic
export const dynamic = "force-dynamic";

interface SolanaData {
	price: string;
	change24h: string;
	marketCap: string;
	volume24h: string;
	lastUpdated: string;
	high24h: string;
	low24h: string;
}

/**
 * Internal function to fetch and process Solana price data
 */
async function getSolanaData(): Promise<SolanaData | null> {
	try {
		// Fetch Solana data from CoinGecko API
		const response = await fetch(
			"https://api.coingecko.com/api/v3/coins/solana?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false",
			{
				headers: {
					Accept: "application/json",
					"Accept-Language": "en-US",
				},
				next: { revalidate: 0 },
			},
		);

		if (!response.ok) {
			throw new Error(
				`CoinGecko API responded with status: ${response.status}`,
			);
		}

		const data = await response.json();

		// Format the data
		const formatCurrency = (value: number): string => {
			return new Intl.NumberFormat("en-US", {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			}).format(value);
		};

		const formatLargeNumber = (value: number): string => {
			if (value >= 1e12) {
				return `${(value / 1e12).toFixed(2)}T`;
			}
			if (value >= 1e9) {
				return `${(value / 1e9).toFixed(2)}B`;
			}
			if (value >= 1e6) {
				return `${(value / 1e6).toFixed(2)}M`;
			}
			return formatCurrency(value);
		};

		const formatDate = (dateString: string): string => {
			const date = new Date(dateString);
			return date.toLocaleString("en-US", {
				month: "short",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			});
		};

		if (!data.market_data) {
			throw new Error("No market data available");
		}

		return {
			price: formatCurrency(data.market_data.current_price.usd),
			change24h: data.market_data.price_change_percentage_24h.toFixed(2),
			marketCap: formatLargeNumber(data.market_data.market_cap.usd),
			volume24h: formatLargeNumber(data.market_data.total_volume.usd),
			lastUpdated: formatDate(data.last_updated),
			high24h: formatCurrency(data.market_data.high_24h.usd),
			low24h: formatCurrency(data.market_data.low_24h.usd),
		};
	} catch (error) {
		console.error("Error fetching Solana data:", error);
		return null;
	}
}

async function fetchSolanaDataNoCache(): Promise<SolanaData> {
	const data = await getSolanaData();
	if (!data) {
		return {
			price: "N/A",
			change24h: "0.00",
			marketCap: "N/A",
			volume24h: "N/A",
			lastUpdated: "N/A",
			high24h: "N/A",
			low24h: "N/A",
		};
	}
	return data;
}

const getCachedSolanaData = unstable_cache(
	async (): Promise<SolanaData> => {
		const data = await getSolanaData();
		if (!data) {
			throw new Error("Empty or invalid data - skip caching");
		}
		return data;
	},
	["solana-price-data"],
	{
		tags: ["solana", "cryptocurrency"],
		revalidate: 300,
	},
);

export default async function getData(): Promise<SolanaData> {
	try {
		return await getCachedSolanaData();
	} catch (error) {
		console.log("Cache skipped or error:", error);
		return fetchSolanaDataNoCache();
	}
}
