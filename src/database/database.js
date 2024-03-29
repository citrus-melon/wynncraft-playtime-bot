import { Sequelize, DataTypes } from "sequelize";

const database = new Sequelize(process.env.SEQUELIZE_URI);
export default database;

const DiscordGuild = database.define('DiscordGuild', {
    id: { type: DataTypes.TEXT, primaryKey: true },
    notificationChannel: DataTypes.TEXT
});

const Player = database.define('Player', {
    id: { type: DataTypes.UUID, primaryKey: true },
    onlineSince: DataTypes.DATE
});

const Session = database.define('Session', {
    start: { type: DataTypes.DATE, allowNull: false },
    end: { type: DataTypes.DATE, allowNull: false }
});

DiscordGuild.belongsToMany(Player, { through: 'DiscordGuildPlayers' });
Player.belongsToMany(DiscordGuild, { through: 'DiscordGuildPlayers' });

Player.hasMany(Session, { onDelete: "CASCADE" });
Session.belongsTo(Player, { foreignKey: {allowNull: false} });