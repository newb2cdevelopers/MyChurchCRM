import React from "react";
import GroupsIcon from '@mui/icons-material/Groups';
import { useSelector } from 'react-redux'
import Card from "../Card";
import styles from "../home/home.module.css"
import { iconsProvider } from "../../utils/iconsProvider";

function HomeUser() {

    const user = useSelector(state => state.user)
    const { selectedModuleRoutes } = useSelector(state => state.navigation)

    if (!user.roles || user.roles.length === 0) {
        return <div className={styles.containerHome}>
            {"El usuario no tiene accesos asignados, por favor comuníquese con el administrador"}
        </div>;
    }

    let cards = [];

    if (selectedModuleRoutes.length > 0) {
        cards = selectedModuleRoutes.map((card) => {
            return (
                <div key={card._id}>
                    <Card name={card.name} accesses={null} iconName={iconsProvider[card.icon]} path={card.route} />
                </div>
            );
        });
    } else {
        cards = user.roles.map((card) => {
            return (
                <div key={card.accesses[0].module._id}>
                    <Card name={card.module} accesses={card.accesses} iconName={iconsProvider[card.accesses[0].module.icon]} path={"/dashboard"} />
                </div>
            );
        });
    }

    return <div className={styles.containerHome}>
        {cards}
        <div key={20}>
            <Card name={'Administrar Grupos Familiares'} accesses={null} iconName={<GroupsIcon sx={{ fontSize: 70 }}/>} path={"/administrarGruposFamiliares"} />
        </div>
    </div>;
}

export default HomeUser;
