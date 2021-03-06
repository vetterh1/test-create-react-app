// React
import React from 'react';
import PropTypes from "prop-types";
// HOC
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CheckIcon from '@material-ui/icons/Check';
// Utilities
import clsx from "clsx";



const useStyles = makeStyles(theme => ({

  buttonCheck: {
    border: `1px solid ${theme.palette.buttonCheck.border}`,
    cursor: "pointer",
    display: "flex",
    
    [theme.breakpoints.down('sm')]: {
      // (!) Gutter on the right of the element:
      // The container margin right need to be negative to compensate and to have the last element on the row correctly aligned right
      marginRight: (density) => theme.spacing(density),

      // 2 columns:
      width: (density) => `calc(50% - ${theme.spacing(density === 1 ? 1 : 2)}px)`,
      
      marginBottom: (density) => theme.spacing(density === 1 ? 1 : 2),
      padding: (density) => theme.spacing(0.5 + (density * 0.5)),      
      // padding: (density, selected) => `${theme.spacing(0.5 + (density * 0.5))} - ${selected ? 1 : 0})px`,      

    },
    [theme.breakpoints.up('md')]: {
      minWidth: 200,
      maxWidth: 200,
      margin: (density) => theme.spacing(density),
      padding: (density) => theme.spacing(1 + (density * 0.5)),
    },
  },

  selected: {
    // Selected: border is 1px thicker
    border: `2px solid ${theme.palette.buttonCheck.selected.border}`,
    // But padding is 1px thinner to compensate
    // (final button should have the same size)
    [theme.breakpoints.down('sm')]: {
      padding: (density) => theme.spacing(0.5 + (density * 0.5)) - 1,      
    },
    [theme.breakpoints.up('md')]: {
      padding: (density) => theme.spacing(1 + (density * 0.5)) - 1,
    },
  },

  icon: {
    marginRight: theme.spacing(1),
    cursor: 'pointer',
    color: theme.palette.buttonCheck.icon,
  },

  iconSelected: {
    color: theme.palette.buttonCheck.selected.icon,
  },

  /*
  layout: {

    cursor: 'pointer',
    margin: theme.spacing(1),

    [theme.breakpoints.down('xs')]: {
      minWidth: '100%',
      maxWidth: '100%',
    },
    [theme.breakpoints.up('sm')]: {
      minWidth: 250,
      maxWidth: 250,
    },
  },
  selected: {
    backgroundColor: theme.palette.matrixCard.selected,
    // boxShadow: '3px 3px 6px 2px rgba(0, 0, 0, 0.5), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)'
  },
  avatar: {
    backgroundColor: theme.palette.matrixCard.backgroundColor,
  }
  */

}));

const MatrixCard = ({density, onClick, selected, name /*, label, icon = null */}) => {
  
  const classes = useStyles(density);

  
  return (
    <div 
      className={clsx(
        classes.buttonCheck,
        selected && classes.selected  
      )}
      onClick={onClick} 
      selected={selected}
    >
      <CheckIcon  className={clsx(classes.icon, selected && classes.iconSelected)}/>
      <Typography variant="body2">
        {name}
      </Typography>
    </div>
  );
}

MatrixCard.propTypes = {
  // Props from caller:
  density: PropTypes.oneOf([1, 2, 3]),
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  // label: PropTypes.string,
  // icon: PropTypes.object, 
};


export default MatrixCard;

/*
 <Card 
        className={clsx(classes.layout, {[classes.selected]: selected})} 
        onClick={onClick} 
        raised={selected}
      >
        <CardHeader
          avatar={
            <Avatar 
            className={classes.avatar} 
              aria-label="-"
            >
              {icon || "?" }
            </Avatar>
          }
          title={name}
          subheader={label}
        />
      </Card>
    */