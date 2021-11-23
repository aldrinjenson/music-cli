const prompts = require("prompts");
const { exec } = require("child_process");
const YoutubeMusicApi = require("youtube-music-api");
const api = new YoutubeMusicApi();

const query = (myArgs = process.argv.slice(2).join(" "));
const maxResults = 5;

const getTime = (milli) => {
  const min = Math.round(milli / 1000 / 60);
  const sec = Math.round((milli / 1000) % 60);
  return `${min}m:${sec}s`;
};

const getSong = () => {
  return new Promise((resolve) => {
    api
      .initalize()
      .then(() => {
        api
          .search(query, "song")
          .then(({ content }) => {
            resolve(content);
          })
          .catch((err) => console.log("Error in searching: " + err));
      })
      .catch((err) => console.log("Error in initialising: " + err));
  });
};

const main = async () => {
  const songs = await getSong(query);
  for (let i = 0; i < songs.length && i < maxResults; i++) {
    const { name, artist, album, duration } = songs[i];
    console.log(`${i}. ${name}, ${artist.name || ""}; (${getTime(duration)})`);
  }
  const { choice } = await prompts({
    type: "number",
    name: "choice",
    message: "Enter your choice",
    validate: (val) =>
      +val > maxResults ? `Please choose a valid value` : true,
  });
  const vidId = songs[choice].videoId;

  const { params } = await prompts({
    type: "text",
    name: "params",
    message: "Extra params? (default none)",
    format: (val) => (!val ? "" : val),
  });

  const p = `-f '(bestaudio)[protocol^=http]' ${params}`;
  console.log(params, p);

  exec(`youtube-dl ${vidId} ${p}`);
};

main();
