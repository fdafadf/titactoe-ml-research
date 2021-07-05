export class Tensor
{
    static set(tensor, array)
    {
        if (Tensor._isSingleArray(tensor))
        {
            for (let i = 0; i < tensor.length; i++) 
            {
                tensor[i] = array[i];
            }
        }
        else
        {
            for (let i = 0; i < tensor.length; i++) 
            {
                Tensor.set(tensor[i], array[i]);
            }
        }
    }
    static randomize(tensor)
    {
        if (tensor.shape)
        {
            if (tensor.shape.length == 1 || (tensor.shape.length == 2 && tensor.shape[1] == 1))
            {
                for (let i = 0; i < tensor.length; i++) 
                {
                    tensor[i] = Math.random();
                }
            }
            else
            {
                for (let i = 0; i < tensor.length; i++) 
                {
                    tensor[i].randomize();
                }
            }
        }
        else
        {
            throw "Unsupported";
        }
    }
    static wrap(array)
    {
        array.shape = [array.length, 1];
        return array;
    }
    static empty(shape)
    {
        if (shape.length == 0)
        {
            return 0;
        }

        if (shape.length == 2 && shape[1] == 1)
        {
            const n = shape[0];
            const result = new Array(n);
            result.shape = shape;

            for (let i = 0; i < n; i++) 
            {
                result[i] = 0;
            }

            return result;
        }
        else
        {
            const [n, ...s] = shape;
            const result = new Array(n);
            result.shape = shape;
        
            for (let i = 0; i < n; i++) 
            {
                result[i] = Tensor.empty(s);
            }

            return result;
        }
    }
    static scale(v, s)
    {
        if (typeof s === "number")
        {
            for (let i = 0; i < v.length; i++) 
            {
                v[i] *= s;
            }
        }
        else
        {
            for (let i = 0; i < v.length; i++) 
            {
                v[i] *= s[i];
            }
        }
    }
    static translate(v, t)
    {
        for (let i = 0; i < v.length; i++) 
        {
            v[i] += t[i];
        }
    }
    static transpone(t)
    {
        if (t.shape.length == 2)
        {
            let m = t.shape[0];
            let n = t.shape[1];

            if (n == 1)
            {
                let result = Tensor.empty([n, m]);
    
                for (let i = 0; i < m; i++) 
                {
                    result[i] = t[i];
                }
    
                return result;
            }
            else
            {
                let result = Tensor.empty([n, m]);
    
                for (let i = 0; i < m; i++) 
                {
                    for (let j = 0; j < n; j++) 
                    {
                        result[j][i] = t[i][j];
                    }
                }
    
                return result;
            }
        }
        else
        {
            throw "Unsupported";
        }
    }
    static mul(a, b)
    {
        if (a.shape.length == 1 && b.shape.length == 1)
        {
            let sum = 0;

            for (let i = 0; i < a.length; i++) 
            {
                sum += a[i] * b[i];
            }

            return sum;
        }
        else if (a.shape.length == 2 && b.shape.length == 2)
        {
            if (a.shape[0] == b.shape[1])
            {
                let m = a.shape[1];
                let n = b.shape[0];
                let d = a.shape[0];
                let result = Tensor.empty([n, m]);
                //console.log(`${d}x${m} * ${n}x${d} = ${n}x${m}`);
            
                if (m == 1)
                {
                    for (let i = 0; i < n; i++) 
                    {
                        for (let k = 0; k < d; k++) 
                        {
                            result[i] += a[k] * b[i][k];
                        }
                    }
                }
                else
                {
                    for (let i = 0; i < n; i++) 
                    {
                        for (let j = 0; j < m; j++) 
                        {
                            for (let k = 0; k < d; k++) 
                            {
                                result[i][j] += a[k][j] * b[i][k];
                            }
                        }     
                    }
                }
                
                //console.log(`[0][0] = ${result[0]}`);
                return result;
            }
            else
            {
                throw "Wrong shape's lengths";
            }
        }
        else
        {
            throw "Unsupported";
        }
    }
    static apply(tensor, f)
    {
        if (Tensor._isSingleArray(tensor))
        {
            for (let i = 0; i < tensor.length; i++) 
            {
                tensor[i] = f(tensor[i]);
            }
        }
        else
        {
            for (let i = 0; i < tensor.length; i++) 
            {
                Tensor.set(tensor[i], f);
            }
        }
    }
    static _isSingleArray(tensor)
    {
        return tensor.shape.length == 1 || (tensor.shape.length == 2 && tensor.shape[1] == 1);
    }
}

Array.prototype.clone = function ()
{
    if (this.shape.length == 0)
    {
        return this;
    }
    else 
    {
        const result = this.shape.length == 1 ? [...this] : this.map(a => a.clone());
        result.shape = this.shape;
        return result;
    }
}

Array.prototype.rand = function ()
{
    return this[Math.floor(Math.random() * this.length)];
}

Array.prototype.scale = function (s)
{
    const result = this.clone();
    Tensor.scale(result, s);
    return result;
}

Array.prototype.translate = function (t)
{
    const result = this.clone();
    Tensor.translate(result, t);
    return result;
}

Array.prototype.randomize = function ()
{
    Tensor.randomize(this);
    return this;
}

Array.prototype.mul = function (m)
{
    return Tensor.mul(this, m);
}

Array.prototype.transpone = function ()
{
    return Tensor.transpone(this);
}

Array.prototype.set = function (array)
{
    Tensor.set(this, array);
    return this;
}

Array.prototype.apply = function (f)
{
    Tensor.apply(this, f);
    return this;
}

Array.prototype.shuffle = function()
{
    var j, x, i;
    for (i = this.length - 1; i > 0; i--) 
    {
        j = Math.floor(Math.random() * (i + 1));
        x = this[i];
        this[i] = this[j];
        this[j] = x;
    }
    return this;
}

Array.prototype.indexOfMax = function()
{
    if (this.length === 0)
    {
        return -1;
    }

    var max = this[0];
    var maxIndex = 0;

    for (var i = 1; i < this.length; i++)
    {
        if (this[i] > max)
        {
            maxIndex = i;
            max = this[i];
        }
    }

    return maxIndex;
}