import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import Layout from "../../components/HubLayout";

import useSWR from 'swr'
import axios from 'axios'
import fetcher from "../../lib/fetcher"

export default function HubDashboard() {
  /* Get Page */
  const router = useRouter();

  /* Filters */
  const page = router.query.page ? router.query.page : 0;
  const search = router.query.search ? router.query.search : "";
  const sorted_by = router.query.sort ? router.query.sort : "PlayTime"; 

  const [filterMenu, setFilterMenu] = useState(false);
  const handleFilterDropdown = () => setFilterMenu(!filterMenu);

  /* Fetch Data */
  let { data, error }: any = useSWR(`/api/hub/rankings?page=${page}&search=${search}&sort_by={"${sorted_by}":"desc"}`, fetcher)

  if (error) return <Layout><div className="p-5 text-xl text-white">Failed to load</div></Layout>
  if (!data) return <Layout><div className="p-5 text-xl text-white">Loading...</div></Layout>

  return (
      <>
        <Head>
          <title>Bloody ARK Hub</title>
        </Head>
        <Layout>
          <div>
            <div className="p-4 bg-white dark:bg-bgray-secondary dark:border-gray-700 items-center justify-between border-b border-gray-200 flex">
              <div className="mb-1 w-full">
                <div className="mb-4">
                  <nav className="mb-5" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-2">
                      <li className="inline-flex items-center dark:text-gray-300">
                        <a
                          href="#"
                          className="dark:text-gray-100 text-gray-700 hover:text-gray-900 inline-flex items-center"
                        >
                          <svg
                            className="w-5 h-5 mr-2.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                          </svg>
                          Home
                        </a>
                      </li>
                      <li>
                        <div className="flex items-center dark:text-gray-300">
                          <svg
                            className="w-6 h-6 text-gray-40"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span
                            className="text-gray-400 dark:text-gray-400 ml-1 md:ml-2 font-medium"
                            aria-current="page"
                          >
                            Rankings
                          </span>
                        </div>
                      </li>
                    </ol>
                  </nav>
                  <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-200">
                    Rankings
                  </h1>
                  <div className="sm:flex mt-4">
                    <div className="sm:flex items-center sm:divide-x mb-3 sm:mb-0 hidden">
                      <form className="lg:pr-3" action={`/hub/rankings?page=${page}`} method="GET">
                        <label htmlFor="users-search" className="sr-only">Search</label>
                        <div className="mt-1 relative lg:w-64 xl:w-96 flex">
                          <input type="text" name="search" id="search" className="dark:bg-bgray-overlay bg-gray-50 border dark:border-gray-700 border-gray-400 text-gray-100 sm:text-sm rounded-l-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5" placeholder="Search for players" />
                          <button type="submit" className="inline-flex items-center px-3 py-1 font-bold leading-6 text-md shadow rounded-r-lg text-gray-100 bg-bred-2 transition ease-in-out duration-150">  <i className="fa-solid fa-magnifying-glass m-1 mr-2 my-auto text-gray-100"></i> Search</button>
                        </div>
                      </form>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 ml-auto">
                      <div className=" relative inline-block text-left dropdown">
                        <span className="rounded-md shadow-sm">
                          <button
                            onClick={handleFilterDropdown}
                            className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-gray-300 transition duration-150 ease-in-out bg-bgray-overlay border border-gray-600 rounded-md hover:text-gray-500 focus:outline-none focus:border-gray-600 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
                            type="button"
                            aria-haspopup="true"
                            aria-expanded="true"
                            aria-controls="headlessui-menu-items-117"
                          >
                            <span>
                              Sort By: {sorted_by ? sorted_by : "Play Time"}
                            </span>
                            <svg
                              className="w-5 h-5 ml-2 -mr-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </span>
                        {filterMenu ? 
                        <div className="dropdown-menu transition-all duration-300 transform origin-top-right -translate-y-2 scale-95">
                          <div
                            className="absolute right-0 mt-2 origin-top-right bg-bgray-overlay border border-gray-700 divide-y divide-gray-700 rounded-md shadow-lg outline-none w-[250px]"
                            aria-labelledby="headlessui-menu-button-1"
                            id="headlessui-menu-items-117"
                            role="menu"
                          >
                            <a
                              href={`/hub/rankings?page=${page}&search=${search}`}
                              tabIndex={1}
                              className="text-gray-200 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"
                              role="menuitem"
                            >
                              Play Time
                            </a>
                            <a
                              href={`/hub/rankings?page=${page}&search=${search}&sort=PlayerKills`}
                              tabIndex={0}
                              className="text-gray-200 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"
                              role="menuitem"
                            >
                              Player Kills
                            </a>
                            <a
                              href={`/hub/rankings?page=${page}&search=${search}&sort=DinoKills`}
                              tabIndex={2}
                              className="text-gray-200 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"
                              role="menuitem"
                            >
                              Dino Kills
                            </a>
                            <a
                              href={`/hub/rankings?page=${page}&search=${search}&sort=DinosTamed`}
                              tabIndex={2}
                              className="text-gray-200 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"
                              role="menuitem"
                            >
                              Dinos Tamed
                            </a>
                            <a
                              href={`/hub/rankings?page=${page}&search=${search}&sort=WildDinoKills`}
                              tabIndex={3}
                              className="text-gray-200 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"
                              role="menuitem"
                            >
                              Wild Dino Kills
                            </a>
                          </div>
                        </div>
                        : <></>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pb-12 px-5 sm:px-16">
              {data ? (
                <div className="mt-4 w-full grid grid-cols-1 md:grid-cols-1 xl:grid-cols-1 gap-4">
                  <div>
                    <p className="font-bold text-xl text-gray-800 dark:text-gray-200 mb-2 mt-10">
                      <i className="fa-solid fa-trophy mr-2" /> Bloody ARK&apos;s Top
                      Players
                    </p>
                    <div className="mb-10">
                    {search != "" ? <p className="text-gray-300 my-3">Filtered all results for <strong>{search}</strong></p> : <></> }
                      
                      <div className="overflow-x-auto">
                        <table
                          className="w-full whitespace-nowrap"
                          v-if="$page.props.stats != null"
                        >
                          <tbody>
                            <tr className="focus:outline-none h-16 border-t border-b-[7px] border-gray-200 bg-white dark:border-bgray-bg dark:bg-bgray-secondary">
                            {page == 0 ? <td className="pl-5">
                    <div className="flex items-center">
                      <p className="text-base leading-none text-gray-700 dark:text-gray-400 mr-2 font-bold">Rank</p>
                    </div>
                  </td> : <></> }
                              <td className="pl-5">
                                <div className="flex items-center">
                                  <p className="text-base leading-none text-gray-700 dark:text-gray-400 mr-2 font-bold">
                                    Player Name
                                  </p>
                                </div>
                              </td>
                              <td className="pl-5">
                                <div className="flex items-center">
                                  <p className="text-base leading-none text-gray-700 dark:text-gray-400 mr-2 font-bold">
                                    Tribe Name
                                  </p>
                                </div>
                              </td>
                              <td className="pl-5">
                                <div className="flex items-center">
                                  <p className="text-base leading-none text-gray-700 dark:text-gray-400 mr-2 font-bold">
                                    Play Time
                                  </p>
                                </div>
                              </td>
                              <td className="pl-5">
                                <div className="flex items-center">
                                  <p className="text-base leading-none text-gray-700 dark:text-gray-400 mr-2 font-bold">
                                    Player Kills
                                  </p>
                                </div>
                              </td>
                              <td className="pl-5">
                                <div className="flex items-center">
                                  <p className="text-base leading-none text-gray-700 dark:text-gray-400 mr-2 font-bold">
                                    Dino Kills
                                  </p>
                                </div>
                              </td>
                              <td className="pl-5">
                                <div className="flex items-center">
                                  <p className="text-base leading-none text-gray-700 dark:text-gray-400 mr-2 font-bold">
                                    Wild Dino Kills
                                  </p>
                                </div>
                              </td>
                              <td className="pl-5">
                                <div className="flex items-center">
                                  <p className="text-base leading-none text-gray-700 dark:text-gray-400 mr-2 font-bold">
                                    Dinos Tamed
                                  </p>
                                </div>
                              </td>
                            </tr>
                            {data?.ranking_data?.map((player: any, rank: any) => {
                              return (
                                <tr key={player.PlayerID} className="focus:outline-none h-16 border-t border-b-[7px] border-gray-200 bg-white dark:border-bgray-bg dark:bg-bgray-secondary">
                                                                {page == 0 ? <td className="pl-5">
                                <div className="flex items-center">
                                  <p className="text-base leading-none text-gray-700 dark:text-gray-400 mr-2 font-bold">{rank + 1}</p>
                                </div>
                              </td> : <></> }
                                  <td className="pl-5">
                                    <div className="flex items-center">
                                      <p className="text-base leading-none text-gray-700 dark:text-gray-400 mr-2 font-bold">
                                        {player?.PlayerName}
                                      </p>
                                    </div>
                                  </td>
                                  <td className="pl-5">
                                    <div className="flex items-center">
                                      <p className="text-base leading-none text-gray-700 dark:text-gray-400 mr-2 font-bold">
                                      {player?.TribeName}
                                      </p>
                                    </div>
                                  </td>
                                  <td className="pl-5">
                                    <div className="flex items-center">
                                      <p className="text-base leading-none text-gray-700 dark:text-gray-400 mr-2 font-bold">
                                      {player?.PlayTime ? (parseInt(player?.PlayTime) / 60).toFixed(2) : 0} hrs
                                      </p>
                                    </div>
                                  </td>
                                  <td className="pl-5">
                                    <div className="flex items-center">
                                      <p className="text-base leading-none text-gray-700 dark:text-gray-400 mr-2 font-bold">
                                      {player?.PlayerKills}
                                      </p>
                                    </div>
                                  </td>
                                  <td className="pl-5">
                                    <div className="flex items-center">
                                      <p className="text-base leading-none text-gray-700 dark:text-gray-400 mr-2 font-bold">
                                      {player?.DinoKills}
                                      </p>
                                    </div>
                                  </td>
                                  <td className="pl-5">
                                    <div className="flex items-center">
                                      <p className="text-base leading-none text-gray-700 dark:text-gray-400 mr-2 font-bold">
                                      {player?.WildDinoKills}
                                      </p>
                                    </div>
                                  </td>
                                  <td className="pl-5">
                                    <div className="flex items-center">
                                      <p className="text-base leading-none text-gray-700 dark:text-gray-400 mr-2 font-bold">
                                      {player?.DinosTamed}
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      <p className="text-gray-300">Page <strong>{data?.pagination?.current_page + 1}</strong> of <strong>{data?.pagination?.total_pages + 1}</strong></p>
                      <div className="flex space-x-2 mt-3">
                        {data?.pagination?.prev ?
                        <a href={(data?.pagination?.prev).replace("https://bloody.gg/api/hub/rankings","https://bloody.gg/hub/rankings")} className="inline-flex items-center px-3 py-1 font-bold leading-6 text-md shadow rounded-full text-gray-100 bg-bred-2 transition ease-in-out duration-150">  <i className="fa-solid fa-arrow-left m-1 mr-2 my-auto"></i> Previous</a>
                        : <></>
                        }
                        {data?.pagination?.next ?
                        <a href={(data?.pagination?.next).replace("https://bloody.gg/api/hub/rankings","https://bloody.gg/hub/rankings")} className="inline-flex items-center px-3 py-1 font-bold leading-6 text-md shadow rounded-full text-gray-100 bg-bred-2 transition ease-in-out duration-150">  Next <i className="fa-solid fa-arrow-right m-1 ml-1 my-auto"></i></a>
                        : <></>
                        }
                        </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-700 px-4 py-3 mt-10" role="alert">
                  <div>
                    <div className="my-auto flex justify-center mb-5">
                      <i className="fa-solid fa-clock-rotate-left text-5xl text-bred-2" />
                    </div>
                    <div>
                      <p className="font-bold text-2xl text-center dark:text-gray-100">
                        No data available!
                      </p>
                      <p className="text-lg text-gray-400 mt-2 text-center">
                        We need to wait for the rankings to be recorded.
                        <br />
                        Please check back later.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Layout>
      </>
    )
}
