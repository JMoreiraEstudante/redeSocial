import classes from './Layout.module.css'

const Layout = (props) => {
    document.body.style = 'background: #f9f9fb;';
    return (
        <div className={classes.layout}>
            {props.children}
        </div>
    )
}

export default Layout
