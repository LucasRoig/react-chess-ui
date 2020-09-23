import ApiService from "../services/ApiService";
import t from "tcomb";
import Game from "../models/Game";
import {DbDetails, GameHeader} from "./DbDetails";

const listDatabases = () => {
  return ApiService.get("/database").then(res => {
    if (res.status === 200) {
      return res.data;
    } else {
      throw res;
    }
  }).then(data => {
    console.log(data)
    return data
  }).catch(e => {
    console.error(e);
    //TODO
  })
}

const PostDatabaseRequest = t.struct({
  name: t.String,
}, "PostDatabaseRequest")

const postDatabase = ({name}) => {
  let request = PostDatabaseRequest({name});
  return ApiService.post("/database", request).then(res => {
    if (res.status === 200 || res.status === 201) {
      console.log(res.data)
      return res.data
    } else {
      throw res;
    }
  }).catch(e => {
    console.error(e);
    //TODO
  })
}

const getDetails = (id) => {
  return ApiService.get("/database/" + id).then(res => {
    if (res.status === 200) {
      let d = DbDetails(res.data)
      console.log(d)
      return d;
    } else {
      throw res
    }
  }).catch(e => {
    console.error(e);
    //TODO
  })
}

const createGame = (databaseId) => {
  let game = new Game();
  return ApiService.post("/database/" + databaseId + "/game", game).then(res => {
    if (res.status === 200 || res.status === 201) {
      let gameHeader = GameHeader({
        whiteName: res.data.whiteName,
        blackName: res.data.blackName,
        id: res.data.id
      })
      return gameHeader;
    } else {
      throw res;
    }
  }).catch(e => {
    console.error(e);
    //TODO
  })
}

const deleteDatabase = (databaseId) => {
  return ApiService.delete("/database/" + databaseId).then(res => {
    if (res.status === 200) {
      return true;
    } else {
      throw res;
    }
  }).catch(e => {
    console.error(e);
    //TODO
  });
}

const importPgn = (databaseId, file) => {
  const formData = new FormData();
  formData.append("pgnFile", file, file.name);
  return ApiService.post("/database/" + databaseId + "/uploadPgn", formData).then(res => {
    if (res.status !== 200 && res.status !== 201) {
      throw res;
    } else {
      return GameHeader(...res.data);
    }
  });
}

export default {
  listDatabases,
  postDatabase,
  getDetails,
  createGame,
  deleteDatabase,
  importPgn
}
