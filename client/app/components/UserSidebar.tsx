import { Link, useFetcher } from "@remix-run/react";
import { PlaytreeSummary } from "../types";

type UserSidebarProps = {
	userPlaytreeSummaries: PlaytreeSummary[] | null;
}

export default function UserSidebar(props: UserSidebarProps) {
	const fetcher = useFetcher({ key: "player" })
	return (
		<aside id="sidebar-multi-level-sidebar" className="fixed font-markazi top-0 left-0 z-0 w-64 h-screen" aria-label="Sidebar">
			<div className="h-full border-4 border-green-600 bg-green-200 bg-opacity-50 px-1 pt-16">
				<h3 className="text-2xl font-lilitaOne text-green-600 underline"><strong>Your Playtrees</strong></h3>
				<nav>
					{
						props.userPlaytreeSummaries === null ?
						<p>Log in to Spotify to see your playtrees here.</p>
						: props.userPlaytreeSummaries.map((summary, index) => {
							return (
								<div key={index} className="flex justify-between my-3">
									{summary.name}
									<div className="flex my-auto">
										<fetcher.Form method="POST" action="/">
											<input type="hidden" id="playtreeID" name="playtreeID" value={summary.id} className="text-2xl" />
											<button type="submit" className="bg-green-300 rounded-md px-2 py-1">Play</button>
										</fetcher.Form>
										<Link to={`playtrees/${summary.id}/edit`} replace><button className="ml-3 bg-blue-300 rounded-md z-100 px-2 py-1">Edit</button></Link>
									</div>
								</div>
							)
						})
					}
				</nav>
				{/* <h3 className="text-xl"><strong>Saved Playtrees</strong></h3>
				<nav>
					Not implemented
				</nav> */}
			</div>
		</aside>
	)
}