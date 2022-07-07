import '../css/locationform.css';
import React from "react"
import StreetsSelect from './streetsselect'

class LocationForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isLoading: false, city: [], userIP: [], street: []};
    }

    fetch = () => {
        this.setState({isLoading: true})
        fetch("https://api.ipify.org")
            .then(response => response.text())
            .then(data => {
                this.setState({userIP: data})
            })

        let config = require('../config');
        let url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/iplocate/address?ip=";
        let token = config.dadata_token;
        let options = {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Token " + token
            }
        }
        let res;
        fetch(url + this.state.userIP, options)
            .then(response => response.text())
            .then(data => {
                res = JSON.parse(data)
                this.setState({isLoading: false})
                this.setState({city: res.location.data.city});
            })
    }

    componentDidMount() {
        this.fetch()
    }

    checkKey = (e) => {
        if (e.code == "Enter") {
            this.setState({street: e.target.value})
        }
    }

    checkValue = (e) => {
        e.target.value = e.target.value.replace(/[^A-Za-zА-Яа-я ]/ig, "")
    }

    render() {
        return (
            <div className="locationForm">
                {this.state.isLoading && <p>Loading...</p>}
                {!this.state.isLoading && <p>IP: <input type="text" value={this.state.userIP} readOnly></input></p>}
                {!this.state.isLoading && <p>Город: <input type="text" value={this.state.city} readOnly></input></p>}
                {!this.state.isLoading &&
                    <p>Улица: <input className="streetFilter" type="text" pattern="[A-Za-zА-Яа-яЁё]*" onChange={e => {this.checkValue(e)}} onKeyDown={e => {this.checkKey(e)}}></input>
                    </p>}
                {!this.state.isLoading && <StreetsSelect city={this.state.city} selectedStreet={this.state.street}/>}
            </div>
        )
    }
}

export default LocationForm;