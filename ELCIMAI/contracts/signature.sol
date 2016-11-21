contract signature {
// PUBLICS ATTRIBUTES
address public owner;
transac[] public transacs;
mapping(address => transac) public map;
// Constructor
	function signature()
	{
    owner = msg.sender;
	}
// Structures
struct transac{
	uint somme; // somme
	uint timestamp; // block number
	address from; // origin
	address hash; // hash
	bool isSigned; // est signée ? (t/f)
}
//Functions
function initTransac(uint _somme){
uint transacID = transacs.length++;
        transac p = transacs[transacID];        
        p.somme=_somme;
        p.timestamp =  now;
        p.from =msg.sender;
        p.isSigned=false;
}

function toSign(){
uint transacID = transacs.length-1;
transacs[transacID].isSigned=true;

}
function addHash(address _hash)
{
uint transacID = transacs.length-1;
	transacs[transacID].hash=_hash;
map[_hash]=transacs[transacID];
}

//Modifiers (Constraints)

}