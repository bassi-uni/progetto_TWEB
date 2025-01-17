import React, {FC, useState} from "react";
import useFilter from "../../hooks/useFilter";
import {FaAngleDown, FaAngleUp} from "react-icons/fa";
import {Card, Skeleton, Button} from "@nextui-org/react";
import useLoadTeams from "../../hooks/useLoadTeams";
import TeamCard from "./TeamCard";
import TeamFilterForm from "./TeamFilterForm";
import {FetchError} from "../common/errors/FetchError";
import {ShortClub} from "./types";

/**
 * ClubInfo is a functional component in React.
 * It accepts props of type ClubInfoProps which includes:
 * - id: A string representing the ID of the club.
 *
 * The component maintains a state variable club, which is the club object retrieved from the server.
 * The useFetch custom hook is used to manage the fetching of the club data.
 *
 * The useEffect hook is used to fetch the club data when the component mounts. The fetchData function from the useFetch hook is called with the URL of the club data.
 * If the fetch is successful, the club state is updated with the retrieved data. If the fetch fails, the error state is updated with the error message.
 *
 * If the club data is still loading, a Loading component is returned.
 * If there is an error fetching the club data, a FetchError component is returned.
 *
 * The component calculates the total value and average age of the club's players using the reduce method.
 *
 * The component returns a div element with the club information. The div includes:
 * - A MyBreadcrumbs component displaying the navigation path.
 * - A header with the club name and total market value.
 * - A section with various club details.
 * - A ClubInfoTable component displaying the club's players.
 */
export const TeamSmartGallery: FC = () => {
  const [showForm, setShowForm] = useState(false);

  const { clubs, loading, error,loadMore } = useLoadTeams(30);

  const { filteredData, removeFilter, resetFilters, addFilter, filterNames } = useFilter([...clubs]);

  const handleShowForm = () => {
    setShowForm((prev) => !prev);
  };

  const addNameFilter = (name: string) => {
    addFilter({key:`${name}`, filter: (p: ShortClub) => p.name.toLowerCase().includes(name.toLowerCase())
  });
  };

  const addCompetitionFilter = (competitionName: string) => {
    addFilter({key:`competition-${competitionName}`,filter: (p) =>
        p.domesticCompetition.name.toLowerCase().includes(competitionName.toLowerCase())
    });
  };

  const handleApplyFilters = ({ name, competitionName }: { name: string; competitionName: string }) => {
    if (name.length !== 0) {
      addNameFilter(name);
    }
    if (competitionName.length !== 0) {
      addCompetitionFilter(competitionName);
    }
  };

  return (
    <div className={"w-full h-full flex flex-col items-center text-white gap-[10vh] pb-[10vh]"}>

      <header className={"w-full h-[20vh] flex items-center justify-center gap-[5rem]"}>
        <h1 className={"text-5xl font-['Impact'] text-corvette"}>Clubs</h1>
        <Button
          endContent={showForm ? <FaAngleUp /> : <FaAngleDown />}
          className={"dark"}
          size={"lg"}
          variant={"ghost"}
          onClick={handleShowForm}

        >FILTER</Button>
        <Button onClick={loadMore} className={"bg-corvette"}>
          Load More</Button>
      </header>
      {showForm && (
        <TeamFilterForm
          onRemoveFilter={removeFilter}
          onApplyFilters={handleApplyFilters}
          onClearFilters={resetFilters}
          filterNames={filterNames}
          addNameFilter={addNameFilter}
          addCompetitionFilter={addCompetitionFilter}
          domesticCometitions={clubs.map((club) => club.domesticCompetition)}
        />
      )}
      <main className={"w-4/5 h-full grid grid-cols-2 md:grid-cols-3 grid-flow-row gap-5"}>
        {!loading ? (
          filteredData.map((club) => <TeamCard key={club.clubId} {...club} />)
        ) : (
          Array.from({ length: 10 }).map((_, idx) => (
            <Card className="w-[200px] space-y-5 p-4" radius="lg" key={idx}>
              <Skeleton className="rounded-lg">
                <div className="h-24 rounded-lg bg-default-300"></div>
              </Skeleton>
              <div className="space-y-3">
                <Skeleton className="w-3/5 rounded-lg">
                  <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                </Skeleton>
                <Skeleton className="w-4/5 rounded-lg">
                  <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                </Skeleton>
                <Skeleton className="w-2/5 rounded-lg">
                  <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                </Skeleton>
              </div>
            </Card>
          ))
        )}

      </main>
      {error && (
          <FetchError opened={true} onClose={()=>{}} message={"An error occurred while fetching data, please try again"}></FetchError>
      )}
    </div>
  );
};
