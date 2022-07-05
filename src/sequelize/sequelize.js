import { Sequelize, DataTypes } from "sequelize";
import config from "../../config.js";

const sequelize = new Sequelize(config.sequelizeURI);
export default sequelize;

const DiscordGuild = sequelize.define('DiscordGuild', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    }
});

const Player = sequelize.define('Player', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true
    }
});

const Session = sequelize.define('Session', {
    start: DataTypes.DATE,
    end: DataTypes.DATE
});

DiscordGuild.belongsToMany(Player, { through: 'DiscordGuildPlayers' });
Player.belongsToMany(DiscordGuild, { through: 'DiscordGuildPlayers' });

Player.hasMany(Session, { onDelete: "CASCADE" });
Session.belongsTo(Player, { foreignKey: {allowNull: false} });