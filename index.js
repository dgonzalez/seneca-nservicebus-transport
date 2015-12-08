var seneca = require("seneca");

function color() {
  this.add( 'color:red', function(args,done){
    console.log("Hooooolaaaaaa");
    done(null, {hex:'#FF0000'});
  })
}

seneca().use("seneca-nservicebus-transport").use(color).listen();

seneca().use("seneca-nservicebus-transport").client().act("color:red");
