import Head from "next/head";
import { useState, useEffect } from "react";
import Layout from "../../components/HubLayout";
import ServerCard from "@/components/ServerCard";
import { env } from "process";

export default function HubDashboard({ servers, highpop_servers }: any) {
    return (
        <>
            <Head>
                <title>Bloody ARK Hub</title>
            </Head>
            <Layout>
            <div className="w-full space-x-6 p-10">
                    <div className="px-4 py-2">
                        <div className="p-4 sm:p-8">
                            <h3 className="mb-2 text-4xl font-bold text-gray-800 dark:text-white text-left "><i className="fa-solid fa-circle-question"></i> Having trouble joining?</h3>
                            <p className="mb-5 text-base text-gray-600 dark:text-gray-100 sm:text-lg text-left ">We can help you! Follow this simple step-by-step guide to get started.
                            </p>
                            <p className="mb-5 text-base dark:text-gray-300 sm:text-lg text-left">
                                <br />
                                Step 1: Open Steam and click on view and then servers<br />
                                Step 2: Click on favorites tab and then add a server<br />
                                Step 3: Enter the following Server IP below then click add this address to favorites<br />
                                Step 4: Start Ark Survival and click Join ARK<br />
                                Step 5: Filter for favorites and ensure all other filters are reset<br />
                                Step 6: The server should now visible for you!!<br />
                            </p>
                        </div>
                    </div>
                    <div className="mt-5">
                        <h1 className="text-4xl px-4 py-2 text-left text-gray-50 font-black leading-7 md:leading-10 hidden">
                            <span><i className="fa-solid fa-star" /> Favorites </span>
                        </h1>
                        <p className="text-gray-300 px-4 py-2 mb-16 text-left hidden">You currently have no favorites</p>
                        <h1 className="text-4xl px-4 py-2 text-left text-gray-50 font-black leading-7 md:leading-10">
                            <span><i className="fa-solid fa-chart-area"></i> Most Popular </span>
                        </h1>
                        <div className="grid mt-8  gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-2 mb-5">
                            <ServerCard server={highpop_servers[0]} />
                            <ServerCard server={highpop_servers[1]} />
                        </div>
                        <h1 className="text-4xl px-4 py-2 text-left text-gray-50 font-black leading-7 md:leading-10">
                            <span><i className="fa-solid fa-hard-drive" /> Servers </span>
                        </h1>
                        <div className="grid mt-8  gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                            {servers.map((server: any) => (
                                <ServerCard key={server.id} server={server} />
                            ))}
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export async function getServerSideProps() {
    const servers_res = await fetch(
        `${env.DOMAIN}/api/servers`
    );

    const highpop_res = await fetch(
        `${env.DOMAIN}/api/highpop_servers`
    );

    var servers = await servers_res.json();
    var highpop_servers = await highpop_res.json();

    return {
        props: {
            servers,
            highpop_servers
        },
    };
}

