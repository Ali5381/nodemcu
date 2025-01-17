var $DATA = {},
  state = null,
  state_id = "";

var main_key = "";

const firebaseConfig = {
  apiKey: "AIzaSyBN4dhHntKWRzYYIRUa9Yi-_RYYnOiNnEQ",
  authDomain: "node-515381.firebaseapp.com",
  databaseURL:
    "https://node-515381-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "node-515381",
  storageBucket: "node-515381.firebasestorage.app",
  messagingSenderId: "779350778318",
  appId: "1:779350778318:web:698a4403de0b47343b4b9f",
};

const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database(app);

const $ = ($e) => {
  return document.querySelector($e);
};

function close_ip_info_detail($e) {
  let $cnt = $($e ? ".ip-info-con" : ".ip-detail-con");

  $cnt.querySelectorAll("input").forEach((e) => (e.value = ""));
  $cnt.style.display = "none";
}

function head_loader($e) {
  state = !$e ? true : false;
  $(".header").style.display = !$e ? "none" : "flex";
  $(".detail").style.display = !$e ? "flex" : "none";
  $(".back-img").style.display = !$e ? "block" : "none";
}

function load_header() {
  let $cnt = $(".header ol");
  $ctg = Object.keys($DATA);

  $cnt.innerHTML =
    $ctg.length <= 0
      ? '<li style="text-align: center;">No Catagory Found</li>'
      : "";

  if ($ctg.length <= 0) return 0;

  $ctg.forEach(($e) => {
    let $li = document.createElement("li"),
      $div = document.createElement("div"),
      $img_e = document.createElement("img"),
      $img_d = document.createElement("img"),
      $span = document.createElement("span"),
      $span_g = document.createElement("span");

    $li.className = "dfx f";
    $li.onclick = (event) => {
      if (event.target.nodeName == "IMG") return 0;
      state_id = $e;
      head_loader();
      load_detail();
    };

    $div.className = "dfx";

    $span.innerText = $DATA[$e].cat_name;

    $img_e.src = "./img/edit.svg";
    $img_d.src = "./img/delete.svg";
    $img_d.onclick = () => delete_header($e);

    $span_g.className = "g";
    $span_g.innerText = $DATA[$e].gateway;

    $li.ID = $e;

    $div.append($span);
    $div.append($img_e);
    $div.append($img_d);

    $li.append($div);
    $li.append($span_g);

    $cnt.append($li);
  });
}

function load_detail() {
  let $cnt = document.querySelector(".detail ol");
  $ctg = Object.keys($DATA[state_id]["data"] || {});

  $cnt.innerHTML =
    $ctg.length <= 0 ? '<li style="text-align: center;">No IP Found</li>' : "";

  if ($ctg.length <= 0) return 0;

  let $data = $DATA[state_id]["data"];

  $ctg.forEach(($e) => {
    let $li = document.createElement("li"),
      $div = document.createElement("div"),
      $img_e = document.createElement("img"),
      $img_d = document.createElement("img"),
      $span_n = document.createElement("span"),
      $span_i = document.createElement("span");

    $div.className = "dfx f";

    $span_n.innerText = $data[$e].name;
    $span_n.className = "n";

    $span_i.innerText = $data[$e].ip;
    $span_i.className = "i";

    $img_e.src = "./img/edit.svg";
    $img_d.src = "./img/delete.svg";
    $img_d.onclick = () => delete_detail($e);

    $li.ID = $e;

    $div.append($span_n);
    $div.append($span_i);

    $li.append($div);

    $li.append($img_e);
    $li.append($img_d);

    $cnt.append($li);
  });
}

function delete_header($e) {
  let $conf = confirm(`Do you want to delete: ${$DATA[$e]["cat_name"]}`);
  if (!$conf) return 0;
  const messageRef = firebase.database().ref(`ip_list/${$e}`);
  messageRef
    .remove()
    .then(() => (delete $DATA[$e], load_header()))
    .catch((error) => {
      console.error("Error deleting message:", error);
      popup("Error deleting message. Check the console.");
    });
}

function delete_detail($e) {
  let $conf = confirm(
    `Do you want to delete: ${$DATA[state_id]["data"][$e]["name"]}`
  );
  if (!$conf) return 0;
  const messageRef = firebase.database().ref(`ip_list/${state_id}/data/${$e}`);
  messageRef
    .remove()
    .then(() => load_detail())
    .catch((error) => {
      console.error("Error deleting message:", error);
      popup("Error deleting message. Check the console.");
    });
}

function pop_conts($e) {
  $(state ? ".ip-detail-con" : ".ip-info-con").style.display = "flex";
  document
    .querySelectorAll((state ? ".ip-detail-con" : ".ip-info-con") + " input")
    .forEach(($e) => ($e.value = ""));

  let $btn = document.querySelectorAll(
    (state ? ".ip-detail-con" : ".ip-info-con") + " button"
  );

  if (!$e) {
    $btn[1].style.display = "block";
    $btn[2].style.display = "none";
  } else {
    $btn[1].style.display = "none";
    $btn[2].style.display = "block";
  }
}

function valid_ip(ip, ip1, ip2) {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipv4Regex.test(ip)) return false;

  const parts = ip.split(".").map(Number);

  return parts.every((part) => part >= 0 && part <= 255);
}

function generateRandomId(length, $data) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  if (!$data[result]) return result;
  else generateRandomId(length, $data);
}

function request_ip_info() {
  let $inp = document.querySelectorAll(".ip-info-con-in input"),
    cat_name = $inp[0].value.trim(),
    gateway = $inp[1].value.trim(),
    start = $inp[2].value.trim();

  if (!cat_name || !gateway || !start) {
    alert("Please Fill the inputs Properly");
    return 0;
  }

  if (!valid_ip(gateway)) {
    popup("Gateway IP is not Valid");
    $inp[1].focus();
    return 0;
  }

  if (!valid_ip(start)) {
    popup("First IP not valid");
    $inp[2].focus();
    return 0;
  }

  let padIP = (ip) => {
    return ip
      .split(".")
      .map((part) => part.padStart(3, "0"))
      .join(".");
  };

  let compareIPsPadded = (ip1, ip2) => {
    const padded1 = padIP(ip1);
    const padded2 = padIP(ip2);

    if (padded1 === padded2) return false;
    else return true;
  };

  if (!compareIPsPadded(gateway, start)) {
    popup("Gateway and First IP cannot be Same");
    return 0;
  }

  let $ID = generateRandomId(8, $DATA),
    messageRef = firebase.database().ref(`ip_list/${$ID}`);

  messageRef
    .update({ cat_name, gateway, start, data: {} })
    .then(() => (document.querySelector(".ip-info-con").style.display = "none"))
    .catch((error) => {
      console.log(error);
      popup("Error writing data. Check the console.");
    });

  // localforage
  //   .setItem("DATA", JSON.stringify($DATA))
  //   .then(($e) => {
  //     document.querySelector(".ip-info-con").style.display = "none";
  //     load_header();
  //   })
  //   .catch((_e) => (console.log(_e), alert("Error")));
}

function request_ip_detail() {
  let $inp = document.querySelectorAll(".ip-detail-con-in input"),
    name = $inp[0].value.trim(),
    mac = $inp[2].value.trim(),
    ip = $inp[1].value.trim();

  if (!name || !ip) {
    popup("Please Fill the inputs Properly");
    return 0;
  }

  if (!valid_ip(ip)) {
    popup("Please Fill the IP's Properly");
    $inp[1].focus();
    return 0;
  }

  let $ID = generateRandomId(8, $DATA[state_id]["data"] || {});

  messageRef = firebase.database().ref(`ip_list/${state_id}/data/${$ID}`);

  messageRef
    .update({ name, ip, mac })
    .then(() => (($(".ip-detail-con").style.display = "none"), load_detail()))
    .catch((error) => {
      console.log(error);
      popup("Error writing data. Check the console.");
    });

  // localforage
  //   .setItem("DATA", JSON.stringify($DATA))
  //   .then(($e) => {
  //     $(".ip-detail-con").style.display = "none";
  //     load_detail();
  //   })
  //   .catch((_e) => (console.log(_e), alert("Error")));
}

function ip_search(event) {
  if (event.key !== "Enter") return 0;

  let $inp = $(".detail input").value.trim().toLowerCase(),
    $ol = document.querySelectorAll(".detail ol li");

  $ol.forEach(($e) => {
    if ($e.innerText.toLowerCase().includes($inp)) {
      $e.classList.remove("dn");
    } else $e.classList.add("dn");
  });
}

function ip_inp_search($e) {
  if ($e.value.trim() == "") {
    document
      .querySelectorAll(".detail ol li.dn")
      .forEach(($o) => $o.classList.remove("dn"));
  }
}

function read_firebase() {
  const messagesRef = firebase.database().ref("ip_list");

  messagesRef.on(
    "value",
    (snapshot) => {
      const $e_data = snapshot.val();
      if ($e_data) {
        console.log($e_data);
      }
    },
    (error) => console.error("Error reading data:", error)
  );
}

function write_firebase() {
  const messagesRef = firebase.database().ref("ip_list");

  messagesRef
    .push($DATA)
    .then(() => {
      console.log("Data written successfully!");
    })
    .catch((error) => alert("Error writing data. Check the console."));
}

function popup($i, $b) {
  let $cnt = document.querySelector(".pop-out");
  $cnt.style.display = "flex";
  $cnt.querySelector(".pop-detail").innerText = $i;
  $cnt.querySelectorAll("button")[1].style.display = $b ? "block" : "none";
}

window.onload = () => {
  const messagesRef = firebase.database().ref("ip_list");

  messagesRef.on(
    "value",
    (snapshot) => {
      const $e_data = snapshot.val();
      if ($e_data) {
        main_key = Object.keys($e_data)[0];
        $DATA = $e_data;
      }
      load_header();
    },
    (error) => console.error("Error reading data:", error)
  );

  $(".search input").value = "";

  // localforage
  //   .getItem("DATA")
  //   .then((e) => {
  //     if (!e) {
  //       load_header();
  //       localforage.setItem("DATA", "{}").catch((_e) => console.log(_e));
  //     } else {
  //       localforage
  //         .getItem("DATA")
  //         .then((e) => (($DATA = e ? JSON.parse(e) : {}), load_header()))
  //         .catch((_e) => console.log(_e));
  //     }
  //   })
  //   .catch((_e) => console.log(_e));
};
