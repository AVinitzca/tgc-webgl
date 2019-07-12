Math.lerp = function(a, b, f)
{
    return a + f * (b - a);
};

Math.halfPI = Math.PI * 0.5;

Array.flatten = function(array)
{
    return array.reduce(function (flat, toFlatten)
    {
        return flat.concat((Array.isArray(toFlatten) || toFlatten instanceof Float32Array) ? Array.flatten(toFlatten) : toFlatten);
    }, []);
};