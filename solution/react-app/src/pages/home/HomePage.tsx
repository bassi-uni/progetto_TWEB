import Navbar from "../../components/navbar/Navbar";
import {navbarElements} from "../../constants/navbarElements";

import PlayerSection from "./sections/PlayerSection";
import TeamSection from "./sections/TeamSection";
import {HOME_SECTIONS} from "../../constants/constants";
import MainSection from "./sections/MainSection";

function HomePage() {

    return (
        <>
            <Navbar elements={navbarElements}/>
            <div className="flex flex-col items-center">
                <MainSection name={HOME_SECTIONS.HOME.name} />
                <PlayerSection name={HOME_SECTIONS.PLAYERS.name}/>
                <TeamSection name={HOME_SECTIONS.TEAMS.name}/>
            </div>


        </>
    );
}

export default HomePage;
