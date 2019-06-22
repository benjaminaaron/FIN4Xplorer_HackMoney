import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, MenuItem } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';

class ActionTypeSelector extends Component {
    constructor(props, context) {
        super(props);
        this.contracts = context.drizzle.contracts;
        this.state = {
            selected: 'None',
            dataKey: this.contracts.Fin4Main.methods.getActionNames.cacheCall()
        };
    }

    handleChange = event => {
        this.setState({ selected: event.target.value, name: event.target.name });
    };

    render() {
        if (!this.props.contracts.Fin4Main.initialized) {
            return <span>Initializing...</span>;
        }

        if (!(this.state.dataKey in this.props.contracts.Fin4Main.getActionNames)) {
            return <span>Fetching...</span>;
        }

        var displayData = this.props.contracts.Fin4Main.getActionNames[this.state.dataKey].value;
        var tokenAddressArr = displayData;

        const menuItems = tokenAddressArr.map((tokenAdr, i) => {
            return (
                <MenuItem key={i} value={tokenAdr}>{tokenAdr}</MenuItem>
            );
        });

        return (
            <>
                <InputLabel htmlFor="select-action">action</InputLabel>
                <Select key="select" inputProps={{
                    name: 'action',
                    id: 'select-action',
                }} style={{
                    width: '100%',
                    marginBottom: '15px'
                }} value={this.state.selected} onChange={this.handleChange}>
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {menuItems}
                </Select>
            </>
        );
    }
}

ActionTypeSelector.contextTypes = {
    drizzle: PropTypes.object
};

const mapStateToProps = state => {
    return {
        contracts: state.contracts
    };
};

export default drizzleConnect(ActionTypeSelector, mapStateToProps);
