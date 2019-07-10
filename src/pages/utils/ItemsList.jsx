
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
// import { injectIntl, defineMessages } from "react-intl";
import { injectIntl } from "react-intl";
import ItemCard from './ItemCard'



// const useStyles = makeStyles(theme => ({
//   button: {
//     margin: theme.spacing(1),
//   },
// }));


// const messages = defineMessages({ 
//   column_category: {
//     id: 'dashboard.category',
//     defaultMessage: 'Category',
//     description: 'Category',
//   },
//   column_expiration: {
//     id: 'dashboard.expiration',
//     defaultMessage: 'Expires',
//     description: 'Expires',
//   },
//   column_name: {
//     id: 'dashboard.name',
//     defaultMessage: 'Name',
//     description: 'Name',
//   },
//   column_code: {
//     id: 'dashboard.code',
//     defaultMessage: 'Code',
//     description: 'Code',
//   },
// });


const styles = theme => ({
  layout: {
    display: "flex",
    flexDirection: "row",
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    width: 'auto',
    padding: `${theme.spacing(2)}px 0`,
    // marginLeft: theme.spacing(1),
    // marginRight: theme.spacing(1),
  },
});





const intItemsList = ({arrayItems, onItemChange, classes, intl}) => {
  console.debug('[--- FC ---] Functional component: ItemsList -  arrayItems: ', arrayItems);

  const handleItemChange = (item) => onItemChange(item);

  return (
    <div className={classes.layout}>
      {arrayItems.map(item => <ItemCard  key={item.id} item={item} onItemChange={handleItemChange} /> )}
    </div>
  );
}

export const ItemsList = injectIntl(withStyles(styles)(intItemsList));
