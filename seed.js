var MODEL_PATH = "./models/";
var Camp = require(MODEL_PATH + "campModel");
var Comment = require(MODEL_PATH+"commentModel");

var data = [{
    name: "testinging",
    image: "https://images.unsplash.com/5/unsplash-kitsune-4.jpg?dpr=1.100000023841858&auto=compress,format&fit=crop&w=1199&h=799&q=80&cs=tinysrgb&crop=",
    description: "is a song from Feist's third studio album, The Reminder. It is Feist's most successful single to date. The song was co-written by Sally Seltmann, ... is a song from Feist's third studio album, The Reminder. It is Feist's most successful single to date. The song was co-written by Sally Selt",
}, {
    name: "Stone!!!",
    image: "https://images.unsplash.com/photo-1455905863367-da9adfc8b5d2?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&s=a164c1293cbd001d79aac545193b8f1e",
    description: "(Britain, plural: stone) A unit of mass equal to 14 pounds. Used to measure the weights of people, animals, cheese, wool, etc.(Britain, plural: stone) A unit of mass equal to 14 pounds. Used to measure the weights of people, animals, cheese, wool, etc.(Britain, plural: stone) A unit of mass equal to 14 pounds. Used to measure the weights of people, animals, cheese, wool, etc.(Britain, plural: stone) A unit of mass equal to 14 pounds. Used to measure the weights of people, anima4312ls, cheese, wool, etc."

}];

function Seed() {
    Comment.remove({},function () {
        Camp.remove({}, function () {
            console.log("all camps removed");
            data.forEach(function (aCamp) {
                Camp.create(aCamp, function (err, camp) {
                    console.log("camp created");
                    Comment.create({
                        name: "hello world",
                        content: "this is a comment!"
                    },function (err, aComment) {
                        if (err) {
                            console.log("can not create comment")
                        }else{
                            camp.comments.push(aComment);
                            camp.save();
                        }
                    });

                });
            });
        });
    });
}

module.exports = Seed;

