/**
 * HomePage
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import PokemonList from 'components/PokemonList/Loadable';
import Pager from 'components/Pager/Loadable';

import { loadPokemons } from 'containers/HomePage/actions';
import { API_URL_INITIAL_FETCH } from 'utils/constants';
import {
  makeSelectPokemons,
  makeSelectLoading,
  makeSelectError,
  makeSelectCount,
  makeSelectPrevious,
  makeSelectNext,
} from './selectors';
import reducer from './reducer';
import saga from './saga';

export class HomePage extends Component {
  componentDidMount() {
    this.props.onFetchPokemons();
  }

  render() {
    const {
      loading,
      error,
      pokemons,
      count,
      previous,
      next,
      onLoadPokemonPrevious,
      onLoadPokemonNext,
    } = this.props;
    const pokemonsListProps = {
      loading,
      error,
      pokemons,
      count,
      previous,
      next,
    };
    const paginationProps = {
      error,
      count,
      previous,
      next,
    };
    return (
      <div>
        <Helmet>
          <title>Pokemon List</title>
          <meta name="description" content="Pokemons List" />
        </Helmet>
        <PokemonList {...pokemonsListProps} />
        <Pager
          {...paginationProps}
          onLoadDataPrevious={onLoadPokemonPrevious}
          onLoadDataNext={onLoadPokemonNext}
        />
      </div>
    );
  }
}

HomePage.propTypes = {
  onLoadPokemonPrevious: PropTypes.func,
  onLoadPokemonNext: PropTypes.func,
  onFetchPokemons: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  count: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  previous: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  next: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  pokemons: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({ url: PropTypes.string, name: PropTypes.string })
    ),
    PropTypes.bool,
  ]),
};

const mapStateToProps = createStructuredSelector({
  pokemons: makeSelectPokemons(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
  count: makeSelectCount(),
  previous: makeSelectPrevious(),
  next: makeSelectNext(),
});

function mapDispatchToProps(dispatch) {
  return {
    onFetchPokemons: () => dispatch(loadPokemons(API_URL_INITIAL_FETCH)),
    onLoadPokemonPrevious: (e) => dispatch(loadPokemons(e)),
    onLoadPokemonNext: (e) => dispatch(loadPokemons(e)),
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({ key: 'homePage', reducer });
const withSaga = injectSaga({ key: 'homePage', saga });

export default compose(withReducer, withSaga, withConnect)(HomePage);
