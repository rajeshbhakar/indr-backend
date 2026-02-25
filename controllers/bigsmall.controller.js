const Bet = require("../models/bet.model");
const User = require("../models/user.model");

/* RUN BIG SMALL ROUND */
exports.runRound = async (req, res) => {

    const number = Math.floor(Math.random() * 10) + 1;
    const result = number <= 5 ? "small" : "big";

    const bets = await Bet.find({ game:"bigsmall", status:"pending" });

    for (let bet of bets) {

        if (bet.choice === result) {

            bet.status = "win";
            bet.winAmount = bet.amount * 2;
            await bet.save();

            const user = await User.findById(bet.userId);
            user.coins += bet.winAmount;
            await user.save();

        } else {

            bet.status = "lose";
            await bet.save();

        }
    }

    res.json({
        success:true,
        number,
        result
    });
};
