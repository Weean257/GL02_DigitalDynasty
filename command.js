var Command = {
  check: function () {
    console.log("Command Ready !");
    console.log("Blue level checked".green)
    console.log("Magenta level checked".magenta)
    console.log("Cyan level checked".cyan);
    return true;
  },
};
module.exports = Command;
