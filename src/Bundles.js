// src/Bundles.js

import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import axios from 'axios';
import { Header } from './Header';

class BundleTable extends Component {
  constructor(props) {
    super(props)

    this.state = { bundles: []};
    this.getStats = this.getStats.bind(this);
  }

  getStats() {
    axios({
      method: 'GET',
      headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
      url: `${process.env.REACT_APP_API_URL}/bundles`
    })
    .then(res => {
      this.setState({bundles: res.data});
    })
    .catch(err => {
      console.error(err);
    });
  }

  componentWillMount() {
    this.getStats();
  }

  render() {
    const { bundles } = this.state;

    const columns = [{
      Header: 'District',
      accessor: 'district_id'
    }, {
      Header: 'Available',
      accessor: 'unprepped_count',
    }, {
      Header: 'Prepped',
      accessor: 'prepped_count'
    }, {
      Header: 'Sent',
      accessor: 'sent_count'
    }]

    return(
      <ReactTable data={bundles} columns={columns} className="-striped -highlight" />
    );
  }
}

export class Bundles extends Component {
  render() {
    return (
      <div className="position-relative">
        <Header auth={this.props.auth}/>
        <BundleTable />
      </div>
    );
  }
}
