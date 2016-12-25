
console.log("Misc");
console.log("=====================");


console.log(isEven(-76));

function isEven(number)
{
	if (number < 0)
	{
		number = number * -1;
	}

	if (number == 0)
	{
		return true;
	}
	else if (number == 1)
	{
		return false;
	}

	return isEven((number - 2));
}

