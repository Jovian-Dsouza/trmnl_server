import { PreSatori } from "@/utils/pre-satori";

interface SolanaPriceProps {
	price?: string;
	change24h?: string;
	marketCap?: string;
	volume24h?: string;
	lastUpdated?: string;
	high24h?: string;
	low24h?: string;
}

export default function SolanaPrice({
	price = "Loading...",
	change24h = "0",
	marketCap = "Loading...",
	volume24h = "Loading...",
	lastUpdated = "Loading...",
	high24h = "Loading...",
	low24h = "Loading...",
}: SolanaPriceProps) {
	const isPositive = !change24h.startsWith("-");
	const changeValue = isPositive ? change24h : change24h.substring(1);

	const priceStats = [
		{ label: "Market Cap", value: marketCap },
		{ label: "24h Volume", value: volume24h },
		{ label: "24h High", value: high24h },
		{ label: "24h Low", value: low24h },
	];

	return (
		<PreSatori>
			{(transform) => (
				<>
					{transform(
						<div className="flex flex-col w-[800px] h-[480px] bg-white">
							<div className="flex-none p-4 border-b border-black">
								<h1 className="text-[42px]  truncate">Solana Price Tracker</h1>
							</div>
							<div className="flex-1 overflow-hidden p-4 flex flex-col">
								<div className="flex items-center">
									<div className="flex-1">
										<h2 className="text-9xl ">${price}</h2>
									</div>
									<div className="w-[120px] h-[120px]">
										<picture>
											<source
												srcSet="https://cryptologos.cc/logos/solana-sol-logo.png"
												type="image/png"
											/>
											<img
												src="https://cryptologos.cc/logos/solana-sol-logo.png"
												alt="Solana Logo"
												width={64}
												height={64}
												style={{
													objectFit: "contain",
													width: "128px",
													height: "128px",
													filter:
														"grayscale(100%) brightness(100%) contrast(200%)",
												}}
											/>
										</picture>
									</div>
								</div>
								<div className="text-4xl ">
									{isPositive ? "∆" : "↓"} {changeValue}%
								</div>
							</div>
							<div className="flex-none p-4 flex flex-col">
								<div
									className="w-full flex flex-row mb-4"
									style={{ gap: "16px" }}
								>
									{priceStats.map((stat, index) => (
										<div
											key={index}
											className="p-2 rounded-xl border border-black flex-grow flex flex-col font-geneva9"
										>
											<div className="text-[28px] leading-none m-0">
												{stat.label}
											</div>
											<div className="text-[28px] leading-none m-0">
												${stat.value}
											</div>
										</div>
									))}
								</div>
								<div
									className="w-full flex justify-end text-2xl p-2 rounded-xl dither-100"
									style={{ WebkitTextStroke: "4px white" }}
								>
									{lastUpdated && <span>Last updated: {lastUpdated}</span>}
								</div>
							</div>
						</div>,
					)}
				</>
			)}
		</PreSatori>
	);
}
