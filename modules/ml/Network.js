export class Network
{
    static he( layer )
    {
        let standard = Math.sqrt( 2.0 ) / Math.sqrt( layer[0].length );
        let bound = Math.sqrt( 3.0 ) * standard;

        for ( let neuron of layer ) 
        {
            for ( let i = 0; i < neuron.length; i++ )
            {
                neuron[i] = Math.random() * 2 * bound - bound;
            }
        }

        return layer;
    }

    static _calculateOutputError(layer, output, label)
    {
        let errorSum = 0;

        for (let i = 0; i < output.length; i++) 
        {
            layer[i].error = output[i] - label[i];
            errorSum = (layer[i].error) * (layer[i].error);
        }

        return errorSum;
    }

    static _calculateError(layer, nextLayer)
    {
        for (let i = 0; i < layer.length; i++) 
        {
            let error = 0;

            for (let k = 0; k < nextLayer.length; k++) 
            {
                error += nextLayer[k][i] * nextLayer[k].delta;
            }

            layer[i].error = error;
        }
    }

    static _calculateDelta(layer)
    {
        for (let i = 0; i < layer.length; i++) 
        {
            layer[i].delta = layer[i].error * layer[i].derivative;
        }
    }

    static _calculateGradient(layer)
    {
        for (let i = 0; i < layer.length; i++) 
        {
            Network._calculateNeuronGradient(layer, layer[i]);
        }
    }

    static _calculateNeuronGradient(layer, neuron)
    {
        for (let i = 0; i < neuron.length; i++) 
        {
            neuron.gradient[i] += layer.input[i] * neuron.delta;
        }
    }

    static _applyGradientToWeights(layer, learningRate)
    {
        for (let i = 0; i < layer.length; i++) 
        {
            let neuron = layer[i];

            for (let j = 0; j < neuron.length; j++) 
            {
                neuron[j] -= learningRate * neuron.gradient[j];
            }
        }
    }
    
    constructor( layers )
    {
        this.layers = layers;
    }

    eval( input )
    {
        for ( let i = 0; i < this.layers.length; i++ ) 
        {
            let layer = this.layers[i];
            layer.input = input;
            input = input.mul(layer);

            if (i + 1 < this.layers.length)
            {
                for (let j = 0; j < layer.length; j++) 
                {
                    if (input[j] > 0)
                    {
                        layer[j].derivative = 1;
                    }
                    else
                    {
                        layer[j].derivative = 0;
                        input[j] = 0;
                    }
                }

                input.shape[0]++;
                input.push(1);
            }
            else
            {
                for (let j = 0; j < layer.length; j++) 
                {
                    layer[j].derivative = 2;
                }
            }
        }

        return input;
    }

    train( training_set, learning_rate, batchSize = 4 )
    {
        let error = 0;
        this._clearGradient();

        for ( let i = 0; i < training_set.length; i++ ) 
        {
            let { input, label } = training_set[i];
            let output = this.eval(input);
            let lastLayer = this.layers[this.layers.length - 1];
            error += Network._calculateOutputError(lastLayer, output, label);
            Network._calculateDelta(lastLayer);
            Network._calculateGradient(lastLayer);
            
            for (let j = this.layers.length - 2; j >= 0; j--)
            {
                let layer = this.layers[j];
                let nextLayer = this.layers[j + 1];
                Network._calculateError(layer, nextLayer);
                Network._calculateDelta(layer);
                Network._calculateGradient(layer);
            }

            if ((i + 1) % batchSize == 0 || i + 1 == training_set.length)
            {
                for (let i = 0; i < this.layers.length; i++) 
                {
                    Network._applyGradientToWeights(this.layers[i], learning_rate);
                }

                this._clearGradient();
            }
        }

        return error;
    }    
    
    loadWeights( weights )
    {
        for ( let i = 0; i < this.layers.length; i++ ) 
        {
            this.layers[i].set( weights[i] );
        }
    }

    _clearGradient()
    {
        for ( let i = 0; i < this.layers.length; i++ ) 
        {
            let layer = this.layers[i];
            
            for (let j = 0; j < layer.length; j++) 
            {
                let neuron = layer[j];

                if (!neuron.gradient)
                {
                    neuron.gradient = new Array(neuron.length);
                }

                for (let k = 0; k < neuron.length; k++) 
                {
                    neuron.gradient[k] = 0;
                }
            }
        }
    }
}