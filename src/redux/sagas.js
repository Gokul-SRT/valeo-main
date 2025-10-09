import { all } from 'redux-saga/effects'
import user from './user/sagas'
import settings from './settings/sagas'

export default function* rootSaga() {
  yield all([user(), settings()])
}
