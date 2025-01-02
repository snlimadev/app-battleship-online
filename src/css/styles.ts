import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  containerScrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 10,
  },

  containerView: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },

  subcontainer: {
    flexGrow: 1,
    paddingVertical: 5,
  },

  flexRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  flexColumnContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },

  flexEndContainer: {
    paddingVertical: 5,
    justifyContent: 'flex-end',
  },

  modalOverlay: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },

  battleGridScrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },

  battleGridField: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: 'rgb(0, 0, 0)',
  },

  listHeader: {
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 10,
  },

  listContainer: {
    flexGrow: 0,
    borderWidth: 1,
    paddingHorizontal: 15,
    marginHorizontal: 10,
    marginBottom: 5,
    borderRadius: 10,
    shadowColor: 'rgba(0,0,0, .2)',
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 1,
    shadowRadius: 1,
  },

  loadingCard: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 0,
    borderRadius: 0,
    borderWidth: 0,
  },
});

export default styles;