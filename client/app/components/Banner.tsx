import { Form, Link } from "@remix-run/react";
import { useCallback } from "react";

type BannerProps = {
	isAuthenticated: boolean;
	accountID: string | null;
	displayName: string | null;
}

export default function Banner(props: BannerProps) {
	const handleClearTokens = useCallback(() => {
		if (typeof localStorage !== "undefined") {
			localStorage.removeItem("spotify_access_token")
			localStorage.removeItem("spotify_refresh_token")
		}
	}, [])

	return (
		<div className="bg-green-600 z-40 text-white font-lilitaOne w-full p-3 left-64 top-0 flex justify-between">
			<div className="w-fit">
				<Link to="/?first-visit=false" replace><h1 className='text-4xl underline'>Playtree</h1></Link>
			</div>
			<div className="w-fit my-auto mr-4">
				{
					props.isAuthenticated ?
					<div className="flex">
						<a
							target="_blank"
							rel="noopener noreferrer"
							href={`https://open.spotify.com/user/${props.accountID}`}
							className="my-auto">
							<h4 className="text-xl mr-4 my-auto underline">{props.displayName}</h4>
						</a>
						<Form method="POST" action="/logout">
							<button
								type="submit"
								className="bg-slate-300 rounded-lg px-2 py-1 text-xl text-black font-markazi"
								onClick={handleClearTokens}
								>Logout</button>
						</Form>
					</div>
					: <Link to="/login" replace>
						<button
							type="button"
							className="bg-slate-300 rounded-lg px-2 py-1 text-xl text-black font-markazi"
						>Login</button>
					</Link>
				}
			</div>
		</div>
	)
}