import { Map, List, fromJS } from 'immutable';
import { expect } from 'chai';

import reducer from '../../reducers/notifications';
import {
  NOTIFICATIONS_REQUEST, NOTIFICATIONS_SUCCESS, NOTIFICATIONS_FAILURE,
  MARK_NOTIFICATION_SUCCESS, MARK_REPO_NOTIFICATION_SUCCESS
} from '../../actions';

describe('reducers/notifications.js', () => {
  const initialState = Map({
    response: List(),
    isFetching: false,
    failed: false
  });

  const notifications = fromJS([
    {
      id: 1,
      repository: {
        full_name: 'manosim/gitify'
      },
      text: 'New Release'
    },
    {
      id: 2,
      repository: {
        full_name: 'manosim/gitify'
      },
      text: 'It\'s Great'
    }
  ]);

  it('should return the initial state', () => {

    expect(reducer(undefined, {})).to.eql(initialState);

  });

  it('should handle NOTIFICATIONS_REQUEST', () => {

    const action = {
      type: NOTIFICATIONS_REQUEST
    };

    expect(reducer(undefined, action)).to.eql(
      initialState
        .set('isFetching', true)
        .set('failed', false)
    );

  });

  it('should handle NOTIFICATIONS_SUCCESS', () => {

    expect(reducer(undefined, {})).to.eql(initialState);

    const action = {
      type: NOTIFICATIONS_SUCCESS,
      payload: notifications
    };

    const currentState =
      initialState
        .set('isFetching', true)
        .set('failed', false);

    expect(reducer(currentState, action)).to.eql(
      initialState
        .set('isFetching', false)
        .set('response', notifications)
    );

  });

  it('should handle NOTIFICATIONS_FAILURE', () => {

    const response = {
      error: 404,
      message: 'Oops! Something went wrong.'
    };

    const currentState =
      initialState
        .set('isFetching', true)
        .set('failed', false);

    expect(reducer(currentState, {})).to.eql(currentState);

    const action = {
      type: NOTIFICATIONS_FAILURE,
      payload: response
    };

    expect(reducer(currentState, action)).to.eql(
      initialState
        .set('isFetching', false)
        .set('failed', true)
        .set('response', List())
    );

  });

  it('should handle MARK_NOTIFICATION_SUCCESS', () => {

    const currentState = initialState.set('response', notifications);

    expect(reducer(currentState, {}).get('response').size).to.equal(2);

    const action = {
      type: MARK_NOTIFICATION_SUCCESS,
      meta: {
        id: 1
      }
    };

    expect(reducer(currentState, action).get('response').size).to.equal(1);

  });

  it('should handle MARK_REPO_NOTIFICATION_SUCCESS', () => {

    const currentState = initialState.set('response', notifications);

    expect(reducer(currentState, {}).get('response').size).to.equal(2);

    const action = {
      type: MARK_REPO_NOTIFICATION_SUCCESS,
      meta: {
        repoSlug: 'manosim/gitify'
      }
    };

    expect(reducer(currentState, action).get('response').size).to.equal(0);

  });
});
