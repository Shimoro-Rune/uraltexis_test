import '../css/streetsselect.css';
import React from "react"

class StreetsSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isLoading: false,  streets: []};
    }

    fetch = () => {
        this.setState({isLoading: true})
        let config = require('../config');
        let url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
        let token = config.dadata_token;
        let query = this.props.city + " " + this.props.selectedStreet;
        let options = {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Token " + token
            },
            body: JSON.stringify({query: query})
        }
        let res;
        fetch(url, options)
            .then(response => response.text())
            .then(data => {
                res = JSON.parse(data)
                this.setState({isLoading:false});
                if (res != null) res = this.removeDuplicates(res.suggestions)
                this.setState({streets:res});
            });
    }

    removeDuplicates = (originalArray) => {
        var newArray = [];
        var lookupObject  = {};

        for(var i in originalArray) {
            lookupObject[originalArray[i].data.street] = originalArray[i];
        }

        for(i in lookupObject) {
            newArray.push(lookupObject[i]);
        }
        return newArray;
    }

    componentDidUpdate(prevProps) {
        if (prevProps.selectedStreet !== this.props.selectedStreet) {
            this.fetch();
        }
    }

    render() {
        let empty = (this.state.streets.length <= 0);
        let streetsList = !empty
            && this.state.streets.map((item, i) => {
                return (
                    <option key={i} value={item.data.street}>{item.data.street}</option>
                )
            }, this);

        return (
            <div className="select">
                {!empty ? <select key={this.props.selectedStreet}>{streetsList}</select> : <select key={this.props.selectedStreet} disabled>{streetsList}</select>}
            </div>
        )
    }
}

export default StreetsSelect;