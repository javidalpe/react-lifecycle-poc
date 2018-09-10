import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    state = {canary: false}

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Bienvenido a la POC: Determinismo + Optimización</h1>
        </header>


        <p className="App-intro">
          Para empezar, muestra la consola y haz click en "Envío a Canarias".
        </p>

          <h2>Datos de envio</h2>
	      <input checked={this.state.canary} type="checkbox" value="Envio a Canarias" onChange={e => this.setState({
		      canary: e.target.checked
	      })}/> Envio a las Islas Canarias (IGIC, 7% IVA)
          <h2>Resumen de compra</h2>
	      <Summary canary={this.state.canary}/>
          <div>
          <button>Comprar</button>
          </div>
      </div>
    );
  }
}

const Money = (props) => {
    return props.amount.toFixed(2) + '€';
}

export default App;

let renders = 0;

const items = [
    {name: "Mueble cocina", quantity: 2, value: 75},
	{name: "Juego cuchillos", quantity: 1, value: 60},
	{name: "Mantel", quantity: 2, value: 30},
	{name: "Sillas cocina", quantity: 5, value: 80},
]

class Summary extends Component {

    constructor(props) {
        super(props);
        this.state = this.calculateState();
    }

    componentDidUpdate(prevProps) {
        //Comentar estas lineas para arreglar
        if (prevProps.canary !== this.props.canary) {
	        this.setState(this.calculateState());
        }
    }

    render() {
        let state = this.state;
        //Descomentar estas lineas para arreglar
        //state = this.calculateState();

        console.group(`Render ${renders}`);
        console.log(`Canarias? ${this.props.canary}`);
	    console.log(`IVA ${state.iva}`);
	    console.groupEnd();
        renders++;
        return <table>
            <tbody>
	        { state.items.map(item =>
		        <tr key={item.name}>
			        <td>{item.name}</td>
			        <td>{item.quantity}</td>
                    <td><Money amount={item.quantity * item.value}/></td>
		        </tr>
            )}
	        <tr style={{fontWeight: "bold"}}>
		        <td>Sub Total</td>
		        <td></td>
                <td><Money amount={state.subtotal}/></td>
	        </tr>
	        <tr style={{fontWeight: "bold"}}>
		        <td>Iva</td>
		        <td></td>
                <td>{state.iva}€</td>
	        </tr>
            <tr style={{fontWeight: "bold"}}>
                <td>Total</td>
                <td></td>
                <td><Money amount={state.total}/></td>
            </tr>
            </tbody>
        </table>;
    }

	calculateState() {
		let subtotal = items.reduce((t, i) => t+i.quantity*i.value, 0);
		return {
		    items: items,
            subtotal: subtotal,
            iva: this.props.canary ? '7%':'21%',
            total: this.props.canary? subtotal*1.07:subtotal*1.21
		};
	}
}