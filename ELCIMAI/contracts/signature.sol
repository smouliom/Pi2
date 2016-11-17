contract signature {
// PUBLICS ATTRIBUTES
address public owner;
mapping public (uint => bool) isSign;
transac[] public transacs;
// Constructor
	function signature()
	{
    owner = msg.sender;
	}
// Structures
struct transac{
	uint somme;
	uint timestamp;
	address from;
	uint details;
	bool isSigned;
}
//Functions
function initTransac(uint _somme,uint _details){
uint transacID = transacs.length++;
        transac p = transacs[transacID];        
        p.somme=_sommme;
        p.timestamp =  now;
        p.from =msg.sender;
        p.details=_details;
        isSigned=false;
}

function toSignStruct(uint _id){
transacs[_id].isSigned=true;
}
function toSignMapping(uint _details){
isSign[_details]=true;
}

//Modifiers (Constraints)

}