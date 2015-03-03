<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="/webwork" prefix="ww" %>
<html>
    <head>
        <title><ww:property value="getText('menu.adduser.label')"/></title>
        <meta name="section" content="users" />
    </head>
    <body>

    <div class="crowdForm">

        <form method="post" action="<ww:url namespace="/secure/user" action="adduser" method="update" includeParams="none" />">

            <div class="formTitle">
                <h2>
                    <ww:property value="getText('menu.adduser.label')"/>
                </h2>
            </div>

            <div class="formBody">

                <ww:include value="/include/generic_errors.jsp"/>

                <ww:textfield name="email" size="50">
                    <ww:param name="label" value="getText('user.email.label')"/>
                    <ww:param name="description">
                        <ww:property value="getText('user.email.description')"/>
                    </ww:param>
                    <ww:param name="required" value="true"/>
                </ww:textfield>

                <ww:checkbox name="active" fieldValue="true">
                    <ww:param name="label" value="getText('user.active.label')"/>
                </ww:checkbox>

                <ww:textfield name="name">
                    <ww:param name="label" value="getText('user.name.label')"/>
                    <ww:param name="description">
                        <ww:property value="getText('user.name.description')"/>
                    </ww:param>
                    <ww:param name="required" value="true"/>
                </ww:textfield>

                <ww:textfield name="firstname">
                    <ww:param name="label" value="getText('user.firstname.label')"/>
                    <ww:param name="required" value="true"/>
                </ww:textfield>

                <ww:textfield name="lastname">
                    <ww:param name="label" value="getText('user.lastname.label')"/>
                    <ww:param name="required" value="true"/>
                </ww:textfield>

                <ww:password name="password">
                    <ww:param name="label" value="getText('user.password.label')"/>
                    <ww:param name="required" value="true"/>
                </ww:password>

                <ww:password name="passwordConfirm">
                    <ww:param name="label" value="getText('user.passwordconfirm.label')"/>
                    <ww:param name="required" value="true"/>
                </ww:password>

            </div>

            <div class="formFooter wizardFooter">

                <div class="buttons">
                        <input type="submit" class="button" value="<ww:property value="getText('create.label')"/> &raquo;"/>
                        <input type="button" class="button" value="<ww:property value="getText('cancel.label')"/>" onClick="window.location='<ww:url namespace="/secure/user" action="browseusers" includeParams="none" />';"/>
                </div>
            </div>
        </form>

    </div>

</body>
</html>