<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="/webwork" prefix="ww" %>
<html>
<head>
    <title>
        <ww:property value="getText('menu.viewuser.label')"/>
    </title>
    <meta name="section" content="users"/>
</head>
<body onload="init();">

    <jsp:include page="../../decorator/javascript_tabs.jsp">
        <jsp:param name="totalTabs" value="2"/>
    </jsp:include>

    <script language="javascript">

        function addGroup()
        {
            var form = document.groupsForm;
            form.action = '<ww:url namespace="/secure/user" action="updateuser" method="addGroup" includeParams="none" />';
            form.submit();
        }

    </script>

    <p class="headingInfo">
        <a href="<ww:url namespace="/secure/user" action="adduser" method="default" includeParams="none"/>">
            <ww:property value="getText('menu.adduser.label')"/>
        </a>
        &nbsp; | &nbsp;
        <a href="<ww:url namespace="/secure/user" action="removeuser" method="default" includeParams="none" ><ww:param name="directoryID" value="directoryID" /><ww:param name="name" value="name" /></ww:url>">
            <ww:property value="getText('menu.removeuser.label')"/>
        </a>
    </p>

    <h2>
        <ww:property value="getText('menu.viewuser.label')"/>
        &nbsp;&ndash;&nbsp;
        <ww:property value="name"/>
    </h2>

    <div class="page-content">

        <ul class="tabs">
            <li class="on" id="hreftab1">
                <a href="javascript:processTabs(1);">
                    <ww:property value="getText('menu.details.label')"/>
                </a>
            </li>

            <li id="hreftab2">
                <a href="javascript:processTabs(2);">
                    <ww:property value="getText('menu.group.label')"/>
                </a>
            </li>

        </ul>

        <div class="tabContent" id="tab1">

            <div class="crowdForm">
                <form method="post" name="generalForm" action="<ww:url namespace="/secure/user" action="updateuser" method="updateGeneral" includeParams="none" />">
                    <div class="formBody">

                        <ww:include value="/include/generic_errors.jsp"/>

                        <input type="hidden" name="tab" value="1"/>
                        <input type="hidden" name="name" value="<ww:property value="name" />"/>

                        <ww:include value="/include/generic_form_row.jsp">
                           <ww:param name="label" value="getText('user.name.label')" />
                            <ww:param name="value">
                                    <ww:property value="name"/>
                            </ww:param>
                        </ww:include>

                        <ww:textfield name="email" size="50">
                            <ww:param name="label" value="getText('user.email.label')"/>
                            <ww:param name="description">
                                <ww:property value="getText('user.email.description')"/>
                            </ww:param>
                        </ww:textfield>

                        <ww:checkbox name="active" fieldValue="true">
                            <ww:param name="label" value="getText('user.active.label')"/>
                        </ww:checkbox>

                        <ww:textfield name="firstname">
                            <ww:param name="label" value="getText('user.firstname.label')"/>
                        </ww:textfield>

                        <ww:textfield name="lastname">
                            <ww:param name="label" value="getText('user.lastname.label')"/>
                        </ww:textfield>

                        <ww:password name="password">
                            <ww:param name="label" value="getText('password.label')"/>
                            <ww:param name="description">
                                <ww:property value="getText('user.editpassword.description')"/>
                            </ww:param>
                        </ww:password>

                        <ww:password name="passwordConfirm">
                            <ww:param name="label" value="getText('user.passwordconfirm.label')"/>
                        </ww:password>
                    </div>

                    <div class="formFooter wizardFooter">
                        <div class="buttons">
                            <input type="submit" class="button" value="<ww:property value="getText('update.label')"/> &raquo;"/>
                            <input type="button" class="button" value="<ww:property value="getText('cancel.label')"/>"
                                   onClick="window.location='<ww:url namespace="/secure/user" action="viewuser" method="default" includeParams="none"><ww:param name="directoryID" value="directoryID"/><ww:param name="name" value="name"/><ww:param name="tab" value="1"/></ww:url>';"/>
                        </div>
                    </div>

                </form>

            </div>

        </div>


        <div class="tabContent" id="tab2">

            <div class="crowdForm">
                <form method="post" action="<ww:url namespace="/secure/user" action="updateuser" method="updateGroups" includeParams="none" />" name="groupsForm">
                    <div class="formBody">


                        <ww:include value="/include/generic_errors.jsp"/>

                        <p>
                            <ww:property value="getText('user.groupmappings.text')"/>
                        </p>

                        <ww:set name="userName" value="[0].name"/>

                        <input type="hidden" name="tab" value="2"/>
                        <input type="hidden" name="name" value="<ww:property value="name" />"/>

                        <table id="groupsTable" class="formTable">
                            <tr>
                                <th width="64%">
                                    <ww:property value="getText('browser.group.label')"/>
                                </th>
                                <th width="36%">
                                    <ww:property value="getText('browser.action.label')"/>
                                </th>
                            </tr>

                            <ww:iterator value="subscribedGroups" status="rowstatus">

                                <ww:if test="#rowstatus.odd == true">
                                    <tr class="odd">
                                </ww:if>
                                <ww:else>
                                    <tr class="even">
                                </ww:else>

                                <td>
                                    <ww:property value="name"/>
                                </td>

                                <td>
                                    <a href="<ww:url namespace="/secure/user" action="updateuser" method="removeGroup" includeParams="none" ><ww:param name="tab" value="2"/><ww:param name="removeGroup" value="name" /><ww:param name="name" value="[1].name" /></ww:url>">
                                    <ww:property value="getText('remove.label')"/></a>
                                </td>

                                </tr>

                            </ww:iterator>

                        </table>
                    </div>


                    <div class="formFooter wizardFooter">
                        <div class="buttons">
                            <ww:if test="unsubscribedGroups.size > 0">
                                <select name="unsubscribedGroup" style="width: 270px;">
                                    <ww:iterator value="unsubscribedGroups">
                                        <option value="<ww:property value="name" />">
                                            <ww:property value="name"/>
                                        </option>
                                    </ww:iterator>
                                </select>

                                <input id="add-group" type="button" class="button" value="<ww:property value="getText('add.label')"/> &raquo;" onClick="addGroup();"/>
                            </ww:if>

                            <input type="button" class="button" value="<ww:property value="getText('cancel.label')"/>"
                                   onClick="window.location='<ww:url namespace="/secure/user" action="viewuser" method="default" includeParams="none" ><ww:param name="directoryID" value="[2].directoryID" /><ww:param name="name" value="userName"/><ww:param name="tab" value="2" /></ww:url>';"/>
                        </div>
                    </div>

                </form>
            </div>
        </div>

    </div>


</body>
</html>