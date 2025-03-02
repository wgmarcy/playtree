import type { ActionFunctionArgs, LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ShouldRevalidateFunctionArgs,
	useFetcher,
	useLoaderData,
	useLocation
} from "@remix-run/react";

import Player from "./components/Player";

import styles from "./tailwind.css?url";
import UserSidebar from "./components/UserSidebar";
import Banner from "./components/Banner";
import { playtreeFromJson } from "./types";
import { getSession } from "./sessions";
import { clientFetchWithToken } from "./fetch-with-token";
import { useEffect } from "react";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: styles },
];

export const loader = async ({request} : LoaderFunctionArgs) => {
	const session = await getSession(request.headers.get("Cookie"))

	const playerPlaytreeJson = await fetch("http://localhost:8080/me/player", {
		headers: {
			Authorization: "Bearer " + session.get("accessToken")
		}
	}).then(response => response.json())
	const userPlaytreeSummariesJson = await fetch("http://localhost:8080/playtrees/me", {
		headers: {
			Authorization: "Bearer " + session.get("accessToken")
		}
	}).then(response => response.json())
	return {
		playerPlaytree: playerPlaytreeJson,
		userPlaytreeSummaries: userPlaytreeSummariesJson,
		accessToken: session.get("accessToken"),
		refreshToken: session.get("refreshToken")
	}
}

export function shouldRevalidate({ actionResult, defaultShouldRevalidate }: ShouldRevalidateFunctionArgs): boolean {
	if (!actionResult) {
		return false
	}
	if (!actionResult.revalidate) {
		return false
	}
	return defaultShouldRevalidate
}

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData()
	const id = formData.get("playtreeID");
	await fetch(`http://localhost:8080/me/player?playtree=${id}`, {
		method: "PUT"
	})
	return { autoplay: true, revalidate: true }
}

export default function App() {
	const data = useLoaderData<typeof loader>()
	const playerActionData = useFetcher<typeof action>({ key: "player" })
	const playerPlaytree = playtreeFromJson(data.playerPlaytree)
	const userPlaytreeSummaries = data.userPlaytreeSummaries
	const location = useLocation() // used for React resolution keys

	useEffect(() => {
		if (data.accessToken) {
			localStorage.setItem("spotify_access_token", data.accessToken)
		}
		if (data.refreshToken) {
			localStorage.setItem("spotify_refresh_token", data.refreshToken)
		}
	}, [])

	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body className="bg-amber-100">
				<Scripts />

				<UserSidebar userPlaytreeSummaries={userPlaytreeSummaries} />
				<div className="absolute left-48 w-[calc(100vw-12rem)] h-full">
					<Banner />
					<div className="absolute w-full h-[calc(100%-13rem)] top-16 -bottom-64">
						<Outlet key={location.pathname} />
					</div>
					<Player playtree={playerPlaytree} autoplay={playerActionData.data ? playerActionData.data.autoplay : undefined} />
				</div>
			</body>
		</html>
	);
}
