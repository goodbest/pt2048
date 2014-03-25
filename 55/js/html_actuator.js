function HTMLActuator() {
  this.tileContainer    = document.querySelector(".tile-container");
  this.scoreContainer   = document.querySelector(".score-container");
  this.bestContainer    = document.querySelector(".best-container");
  this.messageContainer = document.querySelector(".game-message");

  this.score = 0;
}

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    self.clearContainer(self.tileContainer);

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });

    self.updateScore(metadata.score);
    self.updateBestScore(metadata.bestScore);

    if (metadata.terminated) {
      if (metadata.over) {
        self.message(false); // You lose
      } else if (metadata.won) {
        self.message(true); // You win!
      }
    }

  });
};

// Continues the game (both restart and keep playing)
HTMLActuator.prototype.continueGame = function () {
  this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile) {

  var text=new Array(19);
  text[0] = " ";
  text[1] = "Pst";
  text[2] = "User";
  text[3] = "PU";
  text[4] = "EU";
  text[5] = "CU";
  text[6] = "IU";
  text[7] = "VU";
  text[8] = "EtrU";
  text[9] = "UU";
  text[10] = "NMtr";
  text[11] = "VIP";
  text[12] = "保种组";
  text[13] = "上传组";
  text[14] = "版主";
  text[15] = "总版主";
  text[16] = "管理员";
  text[17] = "主管";
  text[18] = "??";
  var self = this;
  var text2 = function (n) { var r = 0; while (n > 1) r++, n >>= 1; return r; }

  var wrapper   = document.createElement("div");
  var inner     = document.createElement("div");
  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  var positionClass = this.positionClass(position);

  // We can't use classlist because it somehow glitches when replacing classes
  var classes = ["tile", "tile-" + tile.value, positionClass];

  if (tile.value > 131072) classes.push("tile-super");

  this.applyClasses(wrapper, classes);

  inner.classList.add("tile-inner");
  inner.innerHTML = text[text2(tile.value)];

  if (tile.previousPosition) {
    // Make sure that the tile gets rendered in the previous position first
    window.requestAnimationFrame(function () {
      classes[2] = self.positionClass({ x: tile.x, y: tile.y });
      self.applyClasses(wrapper, classes); // Update the position
    });
  } else if (tile.mergedFrom) {
    classes.push("tile-merged");
    this.applyClasses(wrapper, classes);

    // Render the tiles that merged
    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
  } else {
    classes.push("tile-new");
    this.applyClasses(wrapper, classes);
  }

  // Add the inner part of the tile to the wrapper
  wrapper.appendChild(inner);

  // Put the tile on the board
  this.tileContainer.appendChild(wrapper);
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function (position) {
  return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.positionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.updateScore = function (score) {
  this.clearContainer(this.scoreContainer);

  var difference = score - this.score;
  this.score = score;

  this.scoreContainer.textContent = this.score;

  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "+" + difference;

    this.scoreContainer.appendChild(addition);
  }
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  this.bestContainer.textContent = bestScore;
};

HTMLActuator.prototype.message = function (won) {
var mywintxt=new Array(18);
  mywintxt[0]="不会吧，这个得分太差了";
  mywintxt[1]="目前才是User，路还很长";
  mywintxt[2]="Power User 完全不够用";
  mywintxt[3]="Elite User哦！加油";
  mywintxt[4]="Crazy User，再加把劲";
  mywintxt[5]="Insane User完全停不下来";
  mywintxt[6]="成为Veteran User啦！";
  mywintxt[7]="作为Extreme User，已经很不错了？";
  mywintxt[8]="作为Ultimate User，果然很不错了？";
  mywintxt[9]="我是Nexus Master我自豪！";
  mywintxt[10]="VIP VIP VIP!";
  mywintxt[11]="你真的以为保种组是搞车震的？";
  mywintxt[12]="你真的以为上传组不是机器人么？";
  mywintxt[13]="我才不会说葡萄的论坛版主都是MM";
  mywintxt[14]="打败总版主！迎娶白富美（高富帅）！";
  mywintxt[15]="可惜啊，只见到了紫色小Boss";
  mywintxt[16]="哼哼哼，网站主管，可以做任何事";
var text3 = function (m) { var r = 0; while (m > 1) r++, m >>= 1; return r; }
  var type    = won ? "game-won" : "game-over";
  //var message = won ? "You win!" : maxscore;
  var message = won ? "恭喜你成功登顶！！！" : mywintxt[text3(maxscore)-1];

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;
};

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.classList.remove("game-won");
  this.messageContainer.classList.remove("game-over");
};
