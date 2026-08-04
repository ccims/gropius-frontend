/* eslint-disable */
import * as types from "./graphql";
import type { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n    query searchGropiusUsersForPermissionList($query: String!, $count: Int!) {\n        searchGropiusUsers(query: $query, first: $count) {\n            id\n            username\n        }\n    }\n": typeof types.SearchGropiusUsersForPermissionListDocument;
    "\n    query getIssueListForProjectSidebar(\n        $orderBy: [IssueOrder!]!\n        $count: Int!\n        $skip: Int!\n        $filter: IssueFilterInput\n        $trackable: ID!\n    ) {\n        node(id: $trackable) {\n            __typename\n            ... on Trackable {\n                issues(filter: $filter, orderBy: $orderBy, first: $count, skip: $skip) {\n                    nodes {\n                        ...IssueListItemInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n": typeof types.GetIssueListForProjectSidebarDocument;
    "\n    query getIssueListOnAggregatedIssue(\n        $orderBy: [IssueOrder!]!\n        $count: Int!\n        $skip: Int!\n        $filter: IssueFilterInput\n        $aggregatedIssue: ID!\n    ) {\n        node(id: $aggregatedIssue) {\n            ... on AggregatedIssue {\n                issues(filter: $filter, orderBy: $orderBy, first: $count, skip: $skip) {\n                    nodes {\n                        ...IssueListItemInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n": typeof types.GetIssueListOnAggregatedIssueDocument;
    "\n    query getFilteredIssueListForProjectSidebar($query: String!, $count: Int!, $filter: IssueFilterInput) {\n        searchIssues(query: $query, first: $count, filter: $filter) {\n            ...IssueListItemInfo\n        }\n    }\n": typeof types.GetFilteredIssueListForProjectSidebarDocument;
    "\n    query getInterfaceSpecificationVisibilityInfo($id: ID!, $componentTemplate: ID!) {\n        node(id: $id) {\n            ... on InterfaceSpecification {\n                template {\n                    canBeVisibleOnComponents(filter: { id: { eq: $componentTemplate } }) {\n                        totalCount\n                    }\n                    canBeInvisibleOnComponents(filter: { id: { eq: $componentTemplate } }) {\n                        totalCount\n                    }\n                }\n            }\n        }\n    }\n": typeof types.GetInterfaceSpecificationVisibilityInfoDocument;
    "\n    mutation addInterfaceSpecificationVersionToComponentVersion(\n        $input: AddInterfaceSpecificationVersionToComponentVersionInput!\n    ) {\n        addInterfaceSpecificationVersionToComponentVersion(input: $input) {\n            __typename\n        }\n    }\n": typeof types.AddInterfaceSpecificationVersionToComponentVersionDocument;
    "\n    query getComponentTemplateForDialog($id: ID!) {\n        node(id: $id) {\n            id\n            ... on ComponentTemplate {\n                templateFieldSpecifications {\n                    name\n                    value\n                }\n                componentVersionTemplate {\n                    templateFieldSpecifications {\n                        name\n                        value\n                    }\n                }\n            }\n        }\n    }\n": typeof types.GetComponentTemplateForDialogDocument;
    "\n    mutation createComponentFromDialog($input: CreateComponentInput!) {\n        createComponent(input: $input) {\n            component {\n                id\n                versions {\n                    nodes {\n                        id\n                    }\n                }\n            }\n        }\n    }\n": typeof types.CreateComponentFromDialogDocument;
    "\n    query getComponentVersionTemplateForDialog($component: ID!) {\n        node(id: $component) {\n            id\n            ... on Component {\n                template {\n                    componentVersionTemplate {\n                        id\n                        templateFieldSpecifications {\n                            name\n                            value\n                        }\n                    }\n                }\n            }\n        }\n    }\n": typeof types.GetComponentVersionTemplateForDialogDocument;
    "\n    mutation createComponentVersion($input: CreateComponentVersionInput!) {\n        createComponentVersion(input: $input) {\n            componentVersion {\n                id\n            }\n        }\n    }\n": typeof types.CreateComponentVersionDocument;
    "\n    query getIMSTemplateForDialog($id: ID!) {\n        node(id: $id) {\n            id\n            ... on IMSTemplate {\n                templateFieldSpecifications {\n                    name\n                    value\n                }\n            }\n        }\n    }\n": typeof types.GetImsTemplateForDialogDocument;
    "\n    mutation createIMS($input: CreateIMSInput!) {\n        createIMS(input: $input) {\n            ims {\n                id\n            }\n        }\n    }\n": typeof types.CreateImsDocument;
    "\n    query getIMSProjectTemplateForDialog($id: ID!) {\n        node(id: $id) {\n            id\n            ... on IMS {\n                template {\n                    imsProjectTemplate {\n                        id\n                        templateFieldSpecifications {\n                            name\n                            value\n                        }\n                    }\n                }\n            }\n        }\n    }\n": typeof types.GetImsProjectTemplateForDialogDocument;
    "\n    mutation createIMSProject($input: CreateIMSProjectInput!) {\n        createIMSProject(input: $input) {\n            imsProject {\n                id\n            }\n        }\n    }\n": typeof types.CreateImsProjectDocument;
    "\n    query getInterfaceSpecificationTemplateForDialog($id: ID!) {\n        node(id: $id) {\n            id\n            ... on InterfaceSpecificationTemplate {\n                templateFieldSpecifications {\n                    name\n                    value\n                }\n                interfaceSpecificationVersionTemplate {\n                    templateFieldSpecifications {\n                        name\n                        value\n                    }\n                }\n            }\n        }\n    }\n": typeof types.GetInterfaceSpecificationTemplateForDialogDocument;
    "\n    mutation createInterfaceSpecificationFromDialog($input: CreateInterfaceSpecificationInput!) {\n        createInterfaceSpecification(input: $input) {\n            interfaceSpecification {\n                id\n                versions {\n                    nodes {\n                        id\n                    }\n                }\n            }\n        }\n    }\n": typeof types.CreateInterfaceSpecificationFromDialogDocument;
    "\n    query getInterfaceSpecificationVersionTemplateForDialog($interfaceSpecification: ID!) {\n        node(id: $interfaceSpecification) {\n            id\n            ... on InterfaceSpecification {\n                template {\n                    interfaceSpecificationVersionTemplate {\n                        id\n                        templateFieldSpecifications {\n                            name\n                            value\n                        }\n                    }\n                }\n            }\n        }\n    }\n": typeof types.GetInterfaceSpecificationVersionTemplateForDialogDocument;
    "\n    mutation createInterfaceSpecificationVersion($input: CreateInterfaceSpecificationVersionInput!) {\n        createInterfaceSpecificationVersion(input: $input) {\n            interfaceSpecificationVersion {\n                id\n            }\n        }\n    }\n": typeof types.CreateInterfaceSpecificationVersionDocument;
    "\n    query getIssueTemplateForDialog($id: ID!) {\n        node(id: $id) {\n            id\n            ... on IssueTemplate {\n                templateFieldSpecifications {\n                    name\n                    value\n                }\n            }\n        }\n    }\n": typeof types.GetIssueTemplateForDialogDocument;
    "\n    mutation createIssueFromDialog($input: CreateIssueInput!) {\n        createIssue(input: $input) {\n            issue {\n                id\n            }\n        }\n    }\n": typeof types.CreateIssueFromDialogDocument;
    "\n    query searchIssueTemplatesByName($query: String!, $count: Int!) {\n        searchIssueTemplates(query: $query, first: $count, filter: { isDeprecated: { eq: false } }) {\n            id\n            name\n        }\n    }\n": typeof types.SearchIssueTemplatesByNameDocument;
    "\n    query getIssueTemplateFields($id: ID!) {\n        node(id: $id) {\n            __typename\n            ... on IssueTemplate {\n                ...IssueTemplateFields\n            }\n        }\n    }\n": typeof types.GetIssueTemplateFieldsDocument;
    "\n    query getIssueTemplateName($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on IssueTemplate {\n                name\n            }\n        }\n    }\n": typeof types.GetIssueTemplateNameDocument;
    "\n    mutation createIssueTemplate($input: CreateIssueTemplateInput!) {\n        createIssueTemplate(input: $input) {\n            issueTemplate {\n                ...DefaultIssueTemplateInfo\n            }\n        }\n    }\n": typeof types.CreateIssueTemplateDocument;
    "\n    mutation createLabel($input: CreateLabelInput!) {\n        createLabel(input: $input) {\n            label {\n                ...DefaultLabelInfo\n            }\n        }\n    }\n": typeof types.CreateLabelDocument;
    "\n    mutation createLegalInformation($input: CreateLegalInformationInput!) {\n        createLegalInformation(input: $input) {\n            legalInformation {\n                ...DefaultLegalInformationInfo\n            }\n        }\n    }\n": typeof types.CreateLegalInformationDocument;
    "\n    mutation createProject($input: CreateProjectInput!) {\n        createProject(input: $input) {\n            project {\n                id\n            }\n        }\n    }\n": typeof types.CreateProjectDocument;
    "\n    mutation createView($input: CreateViewInput!) {\n        createView(input: $input) {\n            view {\n                id\n            }\n        }\n    }\n": typeof types.CreateViewDocument;
    "\n    mutation addComponentPermissionToComponent($component: ID!, $componentPermission: ID!) {\n        updateComponent(input: { id: $component, addedPermissions: [$componentPermission] }) {\n            __typename\n        }\n    }\n": typeof types.AddComponentPermissionToComponentDocument;
    "\n    mutation addIMSPermissionToIMS($ims: ID!, $imsPermission: ID!) {\n        updateIMS(input: { id: $ims, addedPermissions: [$imsPermission] }) {\n            __typename\n        }\n    }\n": typeof types.AddImsPermissionToImsDocument;
    "\n    mutation addIssueToTrackableForImport($issue: ID!, $trackable: ID!) {\n        addIssueToTrackable(input: { issue: $issue, trackable: $trackable }) {\n            __typename\n        }\n    }\n": typeof types.AddIssueToTrackableForImportDocument;
    "\n    mutation addLabelToTrackable($trackable: ID!, $label: ID!) {\n        addLabelToTrackable(input: { label: $label, trackable: $trackable }) {\n            __typename\n        }\n    }\n": typeof types.AddLabelToTrackableDocument;
    "\n    mutation addProjectPermissionToProject($project: ID!, $projectPermission: ID!) {\n        updateProject(input: { id: $project, addedPermissions: [$projectPermission] }) {\n            __typename\n        }\n    }\n": typeof types.AddProjectPermissionToProjectDocument;
    "\n    query getPermissionUserList($orderBy: [GropiusUserOrder!]!, $count: Int!, $skip: Int!, $permission: ID!) {\n        node(id: $permission) {\n            ... on BasePermission {\n                users(orderBy: $orderBy, first: $count, skip: $skip) {\n                    nodes {\n                        ...DefaultUserInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n": typeof types.GetPermissionUserListDocument;
    "\n    query getFilteredPermissionUserList($query: String!, $count: Int!, $permission: ID!) {\n        searchGropiusUsers(\n            query: $query\n            first: $count\n            filter: { permissions: { any: { id: { eq: $permission } } } }\n        ) {\n            ...DefaultUserInfo\n        }\n    }\n": typeof types.GetFilteredPermissionUserListDocument;
    "\n    mutation updateLabel($input: UpdateLabelInput!) {\n        updateLabel(input: $input) {\n            label {\n                id\n            }\n        }\n    }\n": typeof types.UpdateLabelDocument;
    "\n    mutation updateLegalInformationForDialog($input: UpdateLegalInformationInput!) {\n        updateLegalInformation(input: $input) {\n            legalInformation {\n                id\n            }\n        }\n    }\n": typeof types.UpdateLegalInformationForDialogDocument;
    "\n    mutation updateIssueType($input: UpdateIssueTypeInput!) {\n        updateIssueType(input: $input) {\n            issueType {\n                id\n            }\n        }\n    }\n": typeof types.UpdateIssueTypeDocument;
    "\n    mutation updateIssuePriority($input: UpdateIssuePriorityInput!) {\n        updateIssuePriority(input: $input) {\n            issuePriority {\n                id\n            }\n        }\n    }\n": typeof types.UpdateIssuePriorityDocument;
    "\n    mutation updateIssueState($input: UpdateIssueStateInput!) {\n        updateIssueState(input: $input) {\n            issueState {\n                id\n            }\n        }\n    }\n": typeof types.UpdateIssueStateDocument;
    "\n    mutation updateAssignmentType($input: UpdateAssignmentTypeInput!) {\n        updateAssignmentType(input: $input) {\n            assignmentType {\n                id\n            }\n        }\n    }\n": typeof types.UpdateAssignmentTypeDocument;
    "\n    mutation updateIssueRelationType($input: UpdateIssueRelationTypeInput!) {\n        updateIssueRelationType(input: $input) {\n            issueRelationType {\n                id\n            }\n        }\n    }\n": typeof types.UpdateIssueRelationTypeDocument;
    "\n    mutation updateViewForDialog($input: UpdateViewInput!) {\n        updateView(input: $input) {\n            view {\n                id\n            }\n        }\n    }\n": typeof types.UpdateViewForDialogDocument;
    "\n    query searchAffectedByIssuesForAutocomplete($query: String!, $count: Int!, $trackable: ID!, $sublistCount: Int) {\n        searchAffectedByIssues(query: $query, first: $count, filter: { relatedTo: $trackable }) {\n            ...DetailedAffectedByIssueInfo\n        }\n    }\n": typeof types.SearchAffectedByIssuesForAutocompleteDocument;
    "\n    query firstComponentVersionsForAutocomplete($component: ID!, $count: Int!) {\n        node(id: $component) {\n            ... on Component {\n                versions(first: $count) {\n                    nodes {\n                        ...DefaultComponentVersionInfo\n                    }\n                }\n            }\n        }\n    }\n": typeof types.FirstComponentVersionsForAutocompleteDocument;
    "\n    query searchTrackablesForAutocomplete($query: String!, $count: Int!) {\n        searchTrackables(query: $query, first: $count) {\n            ...DefaultTrackableInfo\n        }\n    }\n": typeof types.SearchTrackablesForAutocompleteDocument;
    "\n    query firstTrackablesForAutocomplete($count: Int!) {\n        trackables(first: $count) {\n            nodes {\n                ...DefaultTrackableInfo\n            }\n        }\n    }\n": typeof types.FirstTrackablesForAutocompleteDocument;
    "\n    query searchAssignmentTypes($template: ID!, $query: String!, $count: Int!) {\n        searchAssignmentTypes(query: $query, first: $count, filter: { partOf: { any: { id: { eq: $template } } } }) {\n            ...DefaultAssignmentTypeInfo\n        }\n    }\n": typeof types.SearchAssignmentTypesDocument;
    "\n    query firstAssignmentTypes($template: ID!, $count: Int!) {\n        node(id: $template) {\n            ... on IssueTemplate {\n                assignmentTypes(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultAssignmentTypeInfo\n                    }\n                }\n            }\n        }\n    }\n": typeof types.FirstAssignmentTypesDocument;
    "\n    query searchComponentTemplatesForAutocomplete($query: String!, $count: Int!) {\n        searchComponentTemplates(query: $query, first: $count, filter: { isDeprecated: { eq: false } }) {\n            ...DefaultComponentTemplateInfo\n        }\n    }\n": typeof types.SearchComponentTemplatesForAutocompleteDocument;
    "\n    query firstComponentTemplatesForAutocomplete($count: Int!) {\n        componentTemplates(first: $count, orderBy: [{ field: NAME }], filter: { isDeprecated: { eq: false } }) {\n            nodes {\n                ...DefaultComponentTemplateInfo\n            }\n        }\n    }\n": typeof types.FirstComponentTemplatesForAutocompleteDocument;
    "\n    query searchComponentVersions($query: String!, $count: Int!, $component: ID!) {\n        searchComponentVersions(query: $query, first: $count, filter: { component: { id: { eq: $component } } }) {\n            ...DefaultComponentVersionInfo\n        }\n    }\n": typeof types.SearchComponentVersionsDocument;
    "\n    query firstComponentVersions($component: ID!, $count: Int!) {\n        node(id: $component) {\n            id\n            ... on Component {\n                versions(first: $count) {\n                    nodes {\n                        ...DefaultComponentVersionInfo\n                    }\n                }\n            }\n        }\n    }\n": typeof types.FirstComponentVersionsDocument;
    "\n    query searchComponentsForVersionAutocomplete($query: String!, $count: Int!, $filter: ComponentFilterInput) {\n        searchComponents(query: $query, first: $count, filter: $filter) {\n            ...DefaultTrackableInfo\n        }\n    }\n": typeof types.SearchComponentsForVersionAutocompleteDocument;
    "\n    query firstComponentsForVersionAutocomplete($count: Int!, $filter: ComponentFilterInput) {\n        components(first: $count, filter: $filter) {\n            nodes {\n                ...DefaultTrackableInfo\n            }\n        }\n    }\n": typeof types.FirstComponentsForVersionAutocompleteDocument;
    "\n    query searchComponentPermissionsForExternal($query: String!, $count: Int!, $component: ID!) {\n        searchComponentPermissions(\n            query: $query\n            first: $count\n            filter: { nodesWithPermission: { any: { id: { eq: $component } } } }\n        ) {\n            ...DefaultComponentPermissionInfo\n        }\n    }\n": typeof types.SearchComponentPermissionsForExternalDocument;
    "\n    query firstComponentPermissions($component: ID!, $count: Int!) {\n        node(id: $component) {\n            ... on Component {\n                permissions(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultComponentPermissionInfo\n                    }\n                }\n            }\n        }\n    }\n": typeof types.FirstComponentPermissionsDocument;
    "\n    query searchComponentsForPermissionAutocomplete($query: String!, $count: Int!) {\n        searchComponents(query: $query, first: $count) {\n            ...DefaultTrackableInfo\n        }\n    }\n": typeof types.SearchComponentsForPermissionAutocompleteDocument;
    "\n    query firstComponentsForPermissionAutocomplete($count: Int!) {\n        components(first: $count) {\n            nodes {\n                ...DefaultTrackableInfo\n            }\n        }\n    }\n": typeof types.FirstComponentsForPermissionAutocompleteDocument;
    "\n    query searchIMSPermissionsForExternal($query: String!, $count: Int!, $ims: ID!) {\n        searchIMSPermissions(\n            query: $query\n            first: $count\n            filter: { nodesWithPermission: { any: { id: { eq: $ims } } } }\n        ) {\n            ...DefaultIMSPermissionInfo\n        }\n    }\n": typeof types.SearchImsPermissionsForExternalDocument;
    "\n    query firstIMSPermissions($ims: ID!, $count: Int!) {\n        node(id: $ims) {\n            ... on IMS {\n                permissions(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultIMSPermissionInfo\n                    }\n                }\n            }\n        }\n    }\n": typeof types.FirstImsPermissionsDocument;
    "\n    query searchIMSsForExternal($query: String!, $count: Int!) {\n        searchIMSs(query: $query, first: $count) {\n            ...DefaultIMSInfo\n        }\n    }\n": typeof types.SearchImSsForExternalDocument;
    "\n    query searchIssuesForExternal($query: String!, $count: Int!, $trackable: ID!) {\n        searchIssues(query: $query, first: $count, filter: { trackables: { any: { id: { eq: $trackable } } } }) {\n            ...DefaultIssueInfo\n        }\n    }\n": typeof types.SearchIssuesForExternalDocument;
    "\n    query firstIssuesForExternalAutocomplete($trackable: ID!, $count: Int!) {\n        node(id: $trackable) {\n            ... on Component {\n                issues(first: $count, orderBy: [{ field: LAST_UPDATED_AT, direction: DESC }]) {\n                    nodes {\n                        ...DefaultIssueInfo\n                    }\n                }\n            }\n        }\n    }\n": typeof types.FirstIssuesForExternalAutocompleteDocument;
    "\n    query searchTrackablesForExternal($query: String!, $count: Int!) {\n        searchTrackables(query: $query, first: $count) {\n            ...DefaultTrackableInfo\n        }\n    }\n": typeof types.SearchTrackablesForExternalDocument;
    "\n    query firstTrackablesForExternal($count: Int!) {\n        trackables(first: $count) {\n            nodes {\n                ...DefaultTrackableInfo\n            }\n        }\n    }\n": typeof types.FirstTrackablesForExternalDocument;
    "\n    query searchTrackableLabels($trackable: ID!, $query: String!, $count: Int!) {\n        searchLabels(query: $query, first: $count, filter: { trackables: { any: { id: { eq: $trackable } } } }) {\n            ...DefaultLabelInfo\n        }\n    }\n": typeof types.SearchTrackableLabelsDocument;
    "\n    query firstTrackableLabelsForExternal($trackable: ID!, $count: Int!) {\n        node(id: $trackable) {\n            ... on Trackable {\n                labels(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultLabelInfo\n                    }\n                }\n            }\n        }\n    }\n": typeof types.FirstTrackableLabelsForExternalDocument;
    "\n    query searchProjectPermissions($project: ID!, $query: String!, $count: Int!) {\n        searchProjectPermissions(\n            query: $query\n            first: $count\n            filter: { nodesWithPermission: { any: { id: { eq: $project } } } }\n        ) {\n            ...DefaultProjectPermissionInfo\n        }\n    }\n": typeof types.SearchProjectPermissionsDocument;
    "\n    query firstProjectPermissions($project: ID!, $count: Int!) {\n        node(id: $project) {\n            ... on Project {\n                permissions(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultProjectPermissionInfo\n                    }\n                }\n            }\n        }\n    }\n": typeof types.FirstProjectPermissionsDocument;
    "\n    query searchProjectsForPermissionAutocomplete($query: String!, $count: Int!) {\n        searchProjects(query: $query, first: $count) {\n            ...DefaultTrackableInfo\n        }\n    }\n": typeof types.SearchProjectsForPermissionAutocompleteDocument;
    "\n    query firstProjectsForPermissionAutocomplete($count: Int!) {\n        projects(first: $count) {\n            nodes {\n                ...DefaultTrackableInfo\n            }\n        }\n    }\n": typeof types.FirstProjectsForPermissionAutocompleteDocument;
    "\n    query searchGropiusUsers($query: String!, $count: Int!, $filter: GropiusUserFilterInput) {\n        searchGropiusUsers(query: $query, first: $count, filter: $filter) {\n            ...DefaultUserInfo\n        }\n    }\n": typeof types.SearchGropiusUsersDocument;
    "\n    query searchIMSs($query: String!, $count: Int!, $filter: IMSFilterInput) {\n        searchIMSs(query: $query, first: $count, filter: $filter) {\n            ...DefaultIMSInfo\n        }\n    }\n": typeof types.SearchImSsDocument;
    "\n    query firstIMSs($count: Int!, $filter: IMSFilterInput) {\n        imss(first: $count, filter: $filter) {\n            nodes {\n                ...DefaultIMSInfo\n            }\n        }\n    }\n": typeof types.FirstImSsDocument;
    "\n    query searchIMSTemplatesForAutocomplete($query: String!, $count: Int!) {\n        searchIMSTemplates(query: $query, first: $count, filter: { isDeprecated: { eq: false } }) {\n            ...DefaultIMSTemplateInfo\n        }\n    }\n": typeof types.SearchImsTemplatesForAutocompleteDocument;
    "\n    query firstIMSTemplatesForAutocomplete($count: Int!) {\n        imsTemplates(first: $count, orderBy: [{ field: NAME }], filter: { isDeprecated: { eq: false } }) {\n            nodes {\n                ...DefaultIMSTemplateInfo\n            }\n        }\n    }\n": typeof types.FirstImsTemplatesForAutocompleteDocument;
    "\n    query searchInterfaceSpecifications($query: String!, $count: Int!, $component: ID!) {\n        searchInterfaceSpecifications(query: $query, first: $count, filter: { component: { id: { eq: $component } } }) {\n            ...DefaultInterfaceSpecificationInfo\n        }\n    }\n": typeof types.SearchInterfaceSpecificationsDocument;
    "\n    query firstInterfaceSpecifications($count: Int!, $component: ID!) {\n        node(id: $component) {\n            ... on Component {\n                interfaceSpecifications(first: $count) {\n                    nodes {\n                        ...DefaultInterfaceSpecificationInfo\n                    }\n                }\n            }\n        }\n    }\n": typeof types.FirstInterfaceSpecificationsDocument;
    "\n    query searchInterfaceSpecificationTemplates(\n        $query: String!\n        $count: Int!\n        $filter: InterfaceSpecificationTemplateFilterInput\n    ) {\n        searchInterfaceSpecificationTemplates(query: $query, first: $count, filter: $filter) {\n            ...DefaultInterfaceSpecificationTemplateInfo\n        }\n    }\n": typeof types.SearchInterfaceSpecificationTemplatesDocument;
    "\n    query firstInterfaceSpecificationTemplates($count: Int!, $filter: InterfaceSpecificationTemplateFilterInput) {\n        interfaceSpecificationTemplates(first: $count, orderBy: [{ field: NAME }], filter: $filter) {\n            nodes {\n                ...DefaultInterfaceSpecificationTemplateInfo\n            }\n        }\n    }\n": typeof types.FirstInterfaceSpecificationTemplatesDocument;
    "\n    query searchInterfaceSpecificationVersionsForAutocomplete(\n        $query: String!\n        $count: Int!\n        $interfaceSpecification: ID!\n    ) {\n        searchInterfaceSpecificationVersions(\n            query: $query\n            first: $count\n            filter: { interfaceSpecification: { id: { eq: $interfaceSpecification } } }\n        ) {\n            ...DefaultInterfaceSpecificationVersionInfo\n        }\n    }\n": typeof types.SearchInterfaceSpecificationVersionsForAutocompleteDocument;
    "\n    query firstInterfaceSpecificationVersionsForAutocomplete($interfaceSpecification: ID!, $count: Int!) {\n        node(id: $interfaceSpecification) {\n            ... on InterfaceSpecification {\n                versions(first: $count) {\n                    nodes {\n                        ...DefaultInterfaceSpecificationVersionInfo\n                    }\n                }\n            }\n        }\n    }\n": typeof types.FirstInterfaceSpecificationVersionsForAutocompleteDocument;
    "\n    query searchInterfaceSpecificationsForAutocomplete($query: String!, $count: Int!, $component: ID!) {\n        searchInterfaceSpecifications(query: $query, first: $count, filter: { component: { id: { eq: $component } } }) {\n            ...DefaultInterfaceSpecificationInfo\n        }\n    }\n": typeof types.SearchInterfaceSpecificationsForAutocompleteDocument;
    "\n    query firstInterfaceSpecificationsForAutocomplete($count: Int!, $component: ID!) {\n        node(id: $component) {\n            ... on Component {\n                interfaceSpecifications(first: $count) {\n                    nodes {\n                        ...DefaultInterfaceSpecificationInfo\n                    }\n                }\n            }\n        }\n    }\n": typeof types.FirstInterfaceSpecificationsForAutocompleteDocument;
    "\n    query searchInterfaceSpecificationVersionsForModel($query: String!, $count: Int!, $interfaceSpecification: ID!) {\n        searchInterfaceSpecificationVersions(\n            query: $query\n            first: $count\n            filter: { interfaceSpecification: { id: { eq: $interfaceSpecification } } }\n        ) {\n            ...DefaultInterfaceSpecificationVersionInfo\n        }\n    }\n": typeof types.SearchInterfaceSpecificationVersionsForModelDocument;
    "\n    query firstInterfaceSpecificationVersionsForModel($interfaceSpecification: ID!, $count: Int!) {\n        node(id: $interfaceSpecification) {\n            ... on InterfaceSpecification {\n                versions(first: $count) {\n                    nodes {\n                        ...DefaultInterfaceSpecificationVersionInfo\n                    }\n                }\n            }\n        }\n    }\n": typeof types.FirstInterfaceSpecificationVersionsForModelDocument;
    "\n    query getUsedIssueTemplates($trackable: ID!, $filter: String!) {\n        node(id: $trackable) {\n            ... on Trackable {\n                usedIssueTemplates(filter: { name: { contains: $filter } }) {\n                    nodes {\n                        ...DefaultIssueTemplateInfo\n                    }\n                }\n            }\n        }\n    }\n": typeof types.GetUsedIssueTemplatesDocument;
    "\n    query getUsedLabels($trackable: ID!, $filter: String!) {\n        node(id: $trackable) {\n            ... on Trackable {\n                usedLabels(filter: { name: { contains: $filter } }) {\n                    nodes {\n                        ...DefaultLabelInfo\n                        trackables {\n                            nodes {\n                                id\n                                name\n                                description\n                            }\n                        }\n                    }\n                }\n            }\n        }\n    }\n": typeof types.GetUsedLabelsDocument;
    "\n    query firstTrackableLabelsForFilter($trackable: ID!, $count: Int!) {\n        node(id: $trackable) {\n            ... on Trackable {\n                labels(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultLabelInfo\n                        trackables {\n                            nodes {\n                                id\n                                name\n                                description\n                            }\n                        }\n                    }\n                }\n            }\n        }\n    }\n": typeof types.FirstTrackableLabelsForFilterDocument;
    "\n    query getUsedIssuePriorities($trackable: ID!, $filter: String!) {\n        node(id: $trackable) {\n            ... on Trackable {\n                usedIssuePriorities(filter: { name: { contains: $filter } }) {\n                    nodes {\n                        ...DefaultIssuePriorityInfo\n                    }\n                }\n            }\n        }\n    }\n": typeof types.GetUsedIssuePrioritiesDocument;
    "\n    query getUsedIssueTypes($trackable: ID!, $filter: String!) {\n        node(id: $trackable) {\n            ... on Trackable {\n                usedIssueTypes(filter: { name: { contains: $filter } }) {\n                    nodes {\n                        ...DefaultIssueTypeInfo\n                    }\n                }\n            }\n        }\n    }\n": typeof types.GetUsedIssueTypesDocument;
    "\n    query getAssignedUsers($trackable: ID!, $filter: String!) {\n        node(id: $trackable) {\n            ... on Trackable {\n                assignedUsers(filter: { username: { contains: $filter } }) {\n                    nodes {\n                        ...DefaultUserInfo\n                    }\n                }\n            }\n        }\n    }\n": typeof types.GetAssignedUsersDocument;
    "\n    query getUsedIssueStates($trackable: ID!, $filter: String!) {\n        node(id: $trackable) {\n            ... on Trackable {\n                usedIssueStates(filter: { name: { contains: $filter } }) {\n                    nodes {\n                        ...DefaultIssueStateInfo\n                    }\n                }\n            }\n        }\n    }\n": typeof types.GetUsedIssueStatesDocument;
    "\n    query firstAffectedByIssuesForFilter($trackable: ID!, $count: Int!, $sublistCount: Int!) {\n        node(id: $trackable) {\n            ... on Trackable {\n                affectedEntities(first: $count) {\n                    nodes {\n                        ...DetailedAffectedByIssueInfo\n                    }\n                }\n            }\n        }\n    }\n": typeof types.FirstAffectedByIssuesForFilterDocument;
    "\n    query searchAffectedByIssuesForFilter($query: String!, $count: Int!, $trackable: ID!) {\n        searchAffectedByIssues(query: $query, first: $count, filter: { relatedTo: $trackable }) {\n            ...DefaultAffectedByIssueInfo\n            ... on Component {\n                versions(first: 100) {\n                    nodes {\n                        id\n                        version\n                    }\n                }\n            }\n            ... on InterfaceSpecification {\n                versions(first: 100) {\n                    nodes {\n                        id\n                        version\n                        interfaceDefinitions(\n                            first: 100\n                            filter: {\n                                visibleInterface: {}\n                                componentVersion: { component: { id: { eq: $trackable } } }\n                            }\n                        ) {\n                            nodes {\n                                visibleInterface {\n                                    id\n                                }\n                            }\n                        }\n                    }\n                }\n            }\n            ... on InterfaceSpecificationVersion {\n                interfaceDefinitions(\n                    first: 100\n                    filter: { visibleInterface: {}, componentVersion: { component: { id: { eq: $trackable } } } }\n                ) {\n                    nodes {\n                        visibleInterface {\n                            id\n                        }\n                    }\n                }\n            }\n        }\n    }\n": typeof types.SearchAffectedByIssuesForFilterDocument;
    "\n    query searchAffectedByIssuesWithoutTrackableForFilter($query: String!, $count: Int!) {\n        searchAffectedByIssues(query: $query, first: $count) {\n            ...DefaultAffectedByIssueInfo\n            ... on Component {\n                versions(first: 100) {\n                    nodes {\n                        id\n                        version\n                    }\n                }\n            }\n            ... on InterfaceSpecification {\n                versions(first: 100) {\n                    nodes {\n                        id\n                        version\n                        interfaceDefinitions(first: 100, filter: { visibleInterface: {} }) {\n                            nodes {\n                                visibleInterface {\n                                    id\n                                }\n                            }\n                        }\n                    }\n                }\n            }\n            ... on InterfaceSpecificationVersion {\n                interfaceDefinitions(first: 100, filter: { visibleInterface: {} }) {\n                    nodes {\n                        visibleInterface {\n                            id\n                        }\n                    }\n                }\n            }\n        }\n    }\n": typeof types.SearchAffectedByIssuesWithoutTrackableForFilterDocument;
    "\n    query searchIssuePriorities($template: ID!, $query: String!, $count: Int!) {\n        searchIssuePriorities(query: $query, first: $count, filter: { partOf: { any: { id: { eq: $template } } } }) {\n            ...DefaultIssuePriorityInfo\n        }\n    }\n": typeof types.SearchIssuePrioritiesDocument;
    "\n    query firstIssuePriorities($template: ID!, $count: Int!) {\n        node(id: $template) {\n            ... on IssueTemplate {\n                issuePriorities(first: $count, orderBy: [{ field: VALUE }, { field: NAME }]) {\n                    nodes {\n                        ...DefaultIssuePriorityInfo\n                    }\n                }\n            }\n        }\n    }\n": typeof types.FirstIssuePrioritiesDocument;
    "\n    query searchIssueRelationTypes($template: ID!, $query: String!, $count: Int!) {\n        searchIssueRelationTypes(query: $query, first: $count, filter: { partOf: { any: { id: { eq: $template } } } }) {\n            ...DefaultIssueRelationTypeInfo\n        }\n    }\n": typeof types.SearchIssueRelationTypesDocument;
    "\n    query firstIssueRelationTypes($template: ID!, $count: Int!) {\n        node(id: $template) {\n            ... on IssueTemplate {\n                relationTypes(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultIssueRelationTypeInfo\n                    }\n                }\n            }\n        }\n    }\n": typeof types.FirstIssueRelationTypesDocument;
    "\n    query searchIssueStates($template: ID!, $query: String!, $count: Int!) {\n        searchIssueStates(query: $query, first: $count, filter: { partOf: { any: { id: { eq: $template } } } }) {\n            ...DefaultIssueStateInfo\n        }\n    }\n": typeof types.SearchIssueStatesDocument;
    "\n    query firstIssueStates($template: ID!, $count: Int!) {\n        node(id: $template) {\n            ... on IssueTemplate {\n                issueStates(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultIssueStateInfo\n                    }\n                }\n            }\n        }\n    }\n": typeof types.FirstIssueStatesDocument;
    "\n    query searchIssueTemplates($query: String!, $count: Int!) {\n        searchIssueTemplates(query: $query, first: $count, filter: { isDeprecated: { eq: false } }) {\n            ...DefaultIssueTemplateInfo\n        }\n    }\n": typeof types.SearchIssueTemplatesDocument;
    "\n    query firstIssueTemplates($count: Int!) {\n        issueTemplates(first: $count, orderBy: [{ field: NAME }], filter: { isDeprecated: { eq: false } }) {\n            nodes {\n                ...DefaultIssueTemplateInfo\n            }\n        }\n    }\n": typeof types.FirstIssueTemplatesDocument;
    "\n    query searchIssueTypes($template: ID!, $query: String!, $count: Int!) {\n        searchIssueTypes(query: $query, first: $count, filter: { partOf: { any: { id: { eq: $template } } } }) {\n            ...DefaultIssueTypeInfo\n        }\n    }\n": typeof types.SearchIssueTypesDocument;
    "\n    query firstIssueTypes($template: ID!, $count: Int!) {\n        node(id: $template) {\n            ... on IssueTemplate {\n                issueTypes(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultIssueTypeInfo\n                    }\n                }\n            }\n        }\n    }\n": typeof types.FirstIssueTypesDocument;
    "\n    query searchLabels($issue: ID!, $query: String!, $count: Int!) {\n        searchLabels(\n            query: $query\n            first: $count\n            filter: { trackables: { any: { issues: { any: { id: { eq: $issue } } } } } }\n        ) {\n            ...DefaultLabelInfo\n        }\n    }\n": typeof types.SearchLabelsDocument;
    "\n    query firstLabelsForAutocomplete($issue: ID!, $count: Int!) {\n        node(id: $issue) {\n            id\n            ... on Issue {\n                trackables {\n                    nodes {\n                        labels(first: $count, orderBy: [{ field: NAME }]) {\n                            nodes {\n                                ...DefaultLabelInfo\n                            }\n                        }\n                    }\n                }\n            }\n        }\n    }\n": typeof types.FirstLabelsForAutocompleteDocument;
    "\n    query searchRelationTemplates($query: String!, $count: Int!, $filter: RelationTemplateFilterInput) {\n        searchRelationTemplates(query: $query, first: $count, filter: $filter) {\n            ...DefaultRelationTemplateInfo\n        }\n    }\n": typeof types.SearchRelationTemplatesDocument;
    "\n    query getRelationTemplates($count: Int!, $filter: RelationTemplateFilterInput) {\n        relationTemplates(first: $count, filter: $filter) {\n            nodes {\n                ...DefaultRelationTemplateInfo\n            }\n        }\n    }\n": typeof types.GetRelationTemplatesDocument;
    "\n    query getSyncPermissionTargetForSwitch($id: ID!) {\n        node(id: $id) {\n            id\n            ... on IMS {\n                isSyncOthersAllowed\n            }\n        }\n    }\n": typeof types.GetSyncPermissionTargetForSwitchDocument;
    "\n    mutation updateSyncPermissionsForSwitch($input: UpdateSyncPermissionsInput!) {\n        updateSyncPermissions(input: $input) {\n            __typename\n        }\n    }\n": typeof types.UpdateSyncPermissionsForSwitchDocument;
    "\n    query searchTrackables($query: String!, $count: Int!, $filter: TrackableFilterInput) {\n        searchTrackables(query: $query, first: $count, filter: $filter) {\n            ...DefaultTrackableInfo\n        }\n    }\n": typeof types.SearchTrackablesDocument;
    "\n    query firstTrackables($count: Int!, $filter: TrackableFilterInput) {\n        trackables(first: $count, filter: $filter) {\n            nodes {\n                ...DefaultTrackableInfo\n            }\n        }\n    }\n": typeof types.FirstTrackablesDocument;
    "\n    query searchViews($project: ID!, $query: String!, $count: Int!) {\n        searchViews(query: $query, first: $count, filter: { project: { id: { eq: $project } } }) {\n            ...DefaultViewInfo\n        }\n    }\n": typeof types.SearchViewsDocument;
    "\n    query firstViews($project: ID!, $count: Int!) {\n        node(id: $project) {\n            ... on Project {\n                views(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultViewInfo\n                    }\n                }\n            }\n        }\n    }\n": typeof types.FirstViewsDocument;
    "\n    mutation updateBodyForTimeline($id: ID!, $body: String!) {\n        updateBody(input: { id: $id, body: $body }) {\n            body {\n                id\n                body\n                bodyLastEditedAt\n                bodyLastEditedBy {\n                    ...DefaultUserInfo\n                }\n            }\n        }\n    }\n": typeof types.UpdateBodyForTimelineDocument;
    "\n    mutation updateIssueCommentForTimeline($id: ID!, $body: String!) {\n        updateIssueComment(input: { id: $id, body: $body }) {\n            issueComment {\n                id\n                body\n                bodyLastEditedAt\n                bodyLastEditedBy {\n                    ...DefaultUserInfo\n                }\n            }\n        }\n    }\n": typeof types.UpdateIssueCommentForTimelineDocument;
    "\n    mutation createIssueCommentForTimeline($issue: ID!, $body: String!, $answers: ID) {\n        createIssueComment(input: { issue: $issue, body: $body, answers: $answers }) {\n            issueComment {\n                ...IssueCommentTimelineInfo\n            }\n        }\n    }\n": typeof types.CreateIssueCommentForTimelineDocument;
    "\n    mutation deleteIssueCommentForTimeline($id: ID!) {\n        deleteIssueComment(input: { id: $id }) {\n            issueComment {\n                ...IssueCommentTimelineInfo\n            }\n        }\n    }\n": typeof types.DeleteIssueCommentForTimelineDocument;
    "fragment DefaultAffectedByIssueInfo on AffectedByIssue {\n  id\n  ... on Named {\n    name\n    description\n  }\n  ... on ComponentVersion {\n    version\n    component {\n      name\n      description\n    }\n  }\n  ... on InterfaceSpecificationVersion {\n    version\n    interfaceSpecification {\n      name\n      description\n    }\n  }\n  ... on Interface {\n    interfaceDefinition {\n      interfaceSpecificationVersion {\n        version\n        interfaceSpecification {\n          name\n          description\n        }\n      }\n    }\n  }\n  __typename\n}\n\nfragment DetailedAffectedByIssueInfo on AffectedByIssue {\n  ...DefaultAffectedByIssueInfo\n  ... on Component {\n    versions(first: $sublistCount) {\n      nodes {\n        id\n        version\n      }\n    }\n  }\n  ... on InterfaceSpecification {\n    versions(first: $sublistCount) {\n      nodes {\n        id\n        version\n        interfaceDefinitions(\n          first: $sublistCount\n          filter: {visibleInterface: {}, componentVersion: {component: {id: {eq: $trackable}}}}\n        ) {\n          nodes {\n            visibleInterface {\n              id\n            }\n          }\n        }\n      }\n    }\n  }\n  ... on InterfaceSpecificationVersion {\n    interfaceDefinitions(\n      first: $sublistCount\n      filter: {visibleInterface: {}, componentVersion: {component: {id: {eq: $trackable}}}}\n    ) {\n      nodes {\n        visibleInterface {\n          id\n        }\n      }\n    }\n  }\n}": typeof types.DefaultAffectedByIssueInfoFragmentDoc;
    "fragment DefaultAssignmentInfo on Assignment {\n  id\n  user {\n    ...UserTimelineInfo\n  }\n  type {\n    ...DefaultAssignmentTypeInfo\n  }\n}\n\nfragment DefaultAssignmentTypeInfo on AssignmentType {\n  id\n  name\n  description\n}": typeof types.DefaultAssignmentInfoFragmentDoc;
    "fragment DefaultAssignmentTypeInfo on AssignmentType {\n  id\n  name\n  description\n}": typeof types.DefaultAssignmentTypeInfoFragmentDoc;
    "fragment ComponentListItemInfo on Component {\n  id\n  name\n  description\n  template {\n    id\n    name\n    description\n  }\n  ...OpenIssueCount\n}": typeof types.ComponentListItemInfoFragmentDoc;
    "fragment DefaultComponentPermissionInfo on ComponentPermission {\n  id\n  name\n  description\n  entries\n  allUsers\n  users {\n    totalCount\n    nodes {\n      id\n      name: displayName\n    }\n  }\n}": typeof types.DefaultComponentPermissionInfoFragmentDoc;
    "fragment DefaultComponentTemplateInfo on ComponentTemplate {\n  id\n  name\n  description\n  templateFieldSpecifications {\n    name\n    value\n  }\n}\n\nfragment DefaultComponentVersionTemplateInfo on ComponentVersionTemplate {\n  id\n  name\n  description\n  templateFieldSpecifications {\n    name\n    value\n  }\n}": typeof types.DefaultComponentTemplateInfoFragmentDoc;
    "fragment ComponentVersionListItemInfo on ComponentVersion {\n  id\n  version\n  tags\n  interfaceDefinitions(filter: {visibleInterface: {}}) {\n    totalCount\n  }\n}\n\nfragment DefaultComponentVersionInfo on ComponentVersion {\n  id\n  component {\n    name\n    description\n  }\n  version\n  __typename\n}": typeof types.ComponentVersionListItemInfoFragmentDoc;
    "fragment DefaultGlobalPermissionInfo on GlobalPermission {\n  id\n  name\n  description\n  entries\n  allUsers\n  users {\n    totalCount\n    nodes {\n      id\n      name: displayName\n    }\n  }\n}": typeof types.DefaultGlobalPermissionInfoFragmentDoc;
    "fragment GraphInfo on Project {\n  components {\n    nodes {\n      ...GraphComponentVersionInfo\n    }\n  }\n  manageComponents: hasPermission(permission: MANAGE_COMPONENTS)\n  defaultView {\n    id\n  }\n}\n\nfragment GraphComponentVersionInfo on ComponentVersion {\n  version\n  ...GraphRelationPartnerInfo\n  interfaceDefinitions {\n    nodes {\n      visibleInterface {\n        ...GraphRelationPartnerInfo\n      }\n      interfaceSpecificationVersion {\n        id\n        version\n        interfaceSpecification {\n          id\n          name\n          template {\n            ...GraphRelationPartnerTemplateInfo\n          }\n        }\n      }\n    }\n  }\n  component {\n    id\n    name\n    template {\n      ...GraphRelationPartnerTemplateInfo\n    }\n  }\n  relateFromComponent: hasPermission(permission: RELATE_FROM_COMPONENT)\n}\n\nfragment GraphAggregatedIssueInfo on AggregatedIssue {\n  id\n  type {\n    id\n    name\n    iconPath\n  }\n  count\n  isOpen\n  outgoingRelations(filter: {end: {relationPartner: {partOfProject: $project}}}) {\n    nodes {\n      end {\n        id\n        relationPartner {\n          id\n        }\n      }\n      type {\n        name\n        id\n      }\n    }\n  }\n}\n\nfragment GraphRelationPartnerInfo on RelationPartner {\n  id\n  __typename\n  outgoingRelations(filter: {end: {partOfProject: $project}}) {\n    nodes {\n      id\n      template {\n        ...GraphRelationTemplateInfo\n      }\n      end {\n        id\n      }\n    }\n  }\n  aggregatedIssues {\n    nodes {\n      ...GraphAggregatedIssueInfo\n    }\n  }\n}\n\nfragment FillStyleInfo on FillStyle {\n  color\n}\n\nfragment StrokeStyleInfo on StrokeStyle {\n  color\n  dash\n}\n\nfragment GraphRelationPartnerTemplateInfo on RelationPartnerTemplate {\n  id\n  name\n  fill {\n    ...FillStyleInfo\n  }\n  stroke {\n    ...StrokeStyleInfo\n  }\n  shapeType\n  shapeRadius\n}\n\nfragment GraphRelationTemplateInfo on RelationTemplate {\n  name\n  stroke {\n    ...StrokeStyleInfo\n  }\n  markerType\n}": typeof types.GraphInfoFragmentDoc;
    "fragment DefaultIMSInfo on IMS {\n  id\n  name\n  description\n}\n\nfragment IMSListItemInfo on IMS {\n  ...DefaultSyncPermissionTargetInfo\n  template {\n    id\n    name\n    description\n  }\n}": typeof types.DefaultImsInfoFragmentDoc;
    "fragment DefaultIMSPermissionInfo on IMSPermission {\n  id\n  name\n  description\n  entries\n  allUsers\n  users {\n    totalCount\n    nodes {\n      id\n      name: displayName\n    }\n  }\n}": typeof types.DefaultImsPermissionInfoFragmentDoc;
    "fragment DefaultIMSProjectInfo on IMSProject {\n  id\n  name\n  description\n  ims {\n    id\n    name\n    template {\n      id\n      name\n      description\n    }\n  }\n  ...DefaultSyncPermissionTargetInfo\n}": typeof types.DefaultImsProjectInfoFragmentDoc;
    "fragment DefaultIMSTemplateInfo on IMSTemplate {\n  id\n  name\n  description\n  templateFieldSpecifications {\n    name\n    value\n  }\n}\n\nfragment DefaultIMSProjectTemplateInfo on IMSProjectTemplate {\n  id\n  name\n  description\n  templateFieldSpecifications {\n    name\n    value\n  }\n}": typeof types.DefaultImsTemplateInfoFragmentDoc;
    "fragment DefaultInterfaceDefinitionInfo on InterfaceDefinition {\n  id\n  visibleSelfDefined\n  invisibleSelfDefined\n  visibleDerivedBy {\n    totalCount\n  }\n  invisibleDerivedBy {\n    totalCount\n  }\n}": typeof types.DefaultInterfaceDefinitionInfoFragmentDoc;
    "fragment InterfaceSpecificationListItemInfo on InterfaceSpecification {\n  id\n  name\n  description\n  template {\n    id\n    name\n    description\n  }\n}\n\nfragment DefaultInterfaceSpecificationInfo on InterfaceSpecification {\n  id\n  name\n  description\n}": typeof types.InterfaceSpecificationListItemInfoFragmentDoc;
    "fragment DefaultInterfaceSpecificationTemplateInfo on InterfaceSpecificationTemplate {\n  id\n  name\n  description\n  templateFieldSpecifications {\n    name\n    value\n  }\n}\n\nfragment DefaultInterfaceSpecificationVersionTemplateInfo on InterfaceSpecificationVersionTemplate {\n  id\n  name\n  description\n  templateFieldSpecifications {\n    name\n    value\n  }\n}": typeof types.DefaultInterfaceSpecificationTemplateInfoFragmentDoc;
    "fragment InterfaceSpecificationVersionListItemInfo on InterfaceSpecificationVersion {\n  id\n  version\n  tags\n}\n\nfragment DefaultInterfaceSpecificationVersionInfo on InterfaceSpecificationVersion {\n  id\n  interfaceSpecification {\n    name\n    description\n  }\n  version\n  __typename\n}": typeof types.InterfaceSpecificationVersionListItemInfoFragmentDoc;
    "fragment DefaultIssueInfo on Issue {\n  ...DefaultIssueIconInfo\n  id\n  title\n  trackables {\n    nodes {\n      ...DefaultTrackableInfo\n    }\n  }\n}\n\nfragment IssueListItemInfo on Issue {\n  id\n  title\n  createdAt\n  createdBy {\n    ...DefaultUserInfo\n  }\n  state {\n    id\n    name\n  }\n  ...DefaultIssueIconInfo\n  issueComments {\n    totalCount\n  }\n  labels {\n    nodes {\n      ...DefaultLabelInfo\n      trackables {\n        nodes {\n          id\n          name\n          description\n        }\n      }\n    }\n  }\n  assignments {\n    nodes {\n      user {\n        ...DefaultUserInfo\n      }\n    }\n  }\n  priority {\n    ...DefaultIssuePriorityInfo\n  }\n  template {\n    id\n    name\n    description\n  }\n  type {\n    id\n    name\n    iconPath\n  }\n  affects {\n    nodes {\n      id\n    }\n  }\n}\n\nfragment ParticipatingIssueListItemInfo on Issue {\n  ...IssueListItemInfo\n  trackables(first: 1) {\n    nodes {\n      __typename\n      id\n      name\n      description\n    }\n    totalCount\n  }\n}\n\nfragment ProjectComponentIssueListItemInfo on Issue {\n  ...IssueListItemInfo\n  trackables(\n    filter: {isComponentAnd: {versions: {any: {partOfProject: $project}}}}\n  ) {\n    nodes {\n      __typename\n      id\n      name\n      description\n    }\n    totalCount\n  }\n}\n\nfragment DefaultIssueIconInfo on Issue {\n  incomingRelations {\n    totalCount\n  }\n  outgoingRelations {\n    totalCount\n  }\n  state {\n    isOpen\n  }\n  type {\n    iconPath\n  }\n}": typeof types.DefaultIssueInfoFragmentDoc;
    "fragment DefaultIssuePriorityInfo on IssuePriority {\n  id\n  name\n  description\n  value\n}": typeof types.DefaultIssuePriorityInfoFragmentDoc;
    "fragment DefaultIssueRelationTypeInfo on IssueRelationType {\n  id\n  name\n  description\n}": typeof types.DefaultIssueRelationTypeInfoFragmentDoc;
    "fragment DefaultIssueStateInfo on IssueState {\n  id\n  name\n  description\n  isOpen\n}": typeof types.DefaultIssueStateInfoFragmentDoc;
    "fragment DefaultIssueTemplateInfo on IssueTemplate {\n  id\n  name\n  description\n  templateFieldSpecifications {\n    name\n    value\n  }\n}\n\nfragment IssueTemplateFields on IssueTemplate {\n  id\n  name\n  description\n  extends {\n    nodes {\n      id\n    }\n  }\n  issueTypes {\n    nodes {\n      name\n      description\n      iconPath\n    }\n  }\n  issuePriorities {\n    nodes {\n      name\n      description\n      value\n      iconPath\n    }\n  }\n  issueStates {\n    nodes {\n      name\n      description\n      isOpen\n    }\n  }\n  assignmentTypes {\n    nodes {\n      name\n      description\n    }\n  }\n  relationTypes {\n    nodes {\n      name\n      description\n      inverseName\n    }\n  }\n  templateFieldSpecifications {\n    name\n    value\n  }\n}": typeof types.DefaultIssueTemplateInfoFragmentDoc;
    "fragment DefaultIssueTypeInfo on IssueType {\n  id\n  name\n  description\n  iconPath\n}": typeof types.DefaultIssueTypeInfoFragmentDoc;
    "fragment DefaultLabelInfo on Label {\n  id\n  name\n  description\n  color\n}": typeof types.DefaultLabelInfoFragmentDoc;
    "fragment BaseLegalInformationInfo on LegalInformation {\n  id\n  label\n  priority\n}\n\nfragment DefaultLegalInformationInfo on LegalInformation {\n  ...BaseLegalInformationInfo\n  text\n}": typeof types.BaseLegalInformationInfoFragmentDoc;
    "fragment ProjectListItemInfo on Project {\n  id\n  name\n  description\n  ...OpenIssueCount\n}": typeof types.ProjectListItemInfoFragmentDoc;
    "fragment DefaultProjectPermissionInfo on ProjectPermission {\n  id\n  name\n  description\n  entries\n  allUsers\n  users {\n    totalCount\n    nodes {\n      id\n      name: displayName\n    }\n  }\n}": typeof types.DefaultProjectPermissionInfoFragmentDoc;
    "fragment DefaultRelationTemplateInfo on RelationTemplate {\n  id\n  name\n  description\n}": typeof types.DefaultRelationTemplateInfoFragmentDoc;
    "fragment DefaultSyncPermissionTargetInfo on SyncPermissionTarget {\n  __typename\n  id\n  name\n  description\n  isSyncSelfAllowed\n  isSyncOthersAllowed\n}": typeof types.DefaultSyncPermissionTargetInfoFragmentDoc;
    "fragment DefaultTimelineItemInfo on TimelineItem {\n  ... on AddedAffectedEntityEvent {\n    ...AddedAffectedEntityEventTimelineInfo\n  }\n  ... on AddedArtefactEvent {\n    ...AddedArtefactEventTimelineInfo\n  }\n  ... on AddedLabelEvent {\n    ...AddedLabelEventTimelineInfo\n  }\n  ... on AddedToPinnedIssuesEvent {\n    ...AddedToPinnedIssuesEventTimelineInfo\n  }\n  ... on AddedToTrackableEvent {\n    ...AddedToTrackableEventTimelineInfo\n  }\n  ... on Assignment {\n    ...AssignmentTimelineInfo\n  }\n  ... on AssignmentTypeChangedEvent {\n    ...AssignmentTypeChangedEventTimelineInfo\n  }\n  ... on Body {\n    ...BodyTimelineInfo\n  }\n  ... on IncomingRelationTypeChangedEvent {\n    ...IncomingRelationTypeChangedEventTimelineInfo\n  }\n  ... on IssueComment {\n    ...IssueCommentTimelineInfo\n  }\n  ... on IssueRelation {\n    ...IssueRelationTimelineInfo\n  }\n  ... on OutgoingRelationTypeChangedEvent {\n    ...OutgoingRelationTypeChangedEventTimelineInfo\n  }\n  ... on PriorityChangedEvent {\n    ...PriorityChangedEventTimelineInfo\n  }\n  ... on RelatedByIssueEvent {\n    ...RelatedByIssueEventTimelineInfo\n  }\n  ... on RemovedAffectedEntityEvent {\n    ...RemovedAffectedEntityEventTimelineInfo\n  }\n  ... on RemovedArtefactEvent {\n    ...RemovedArtefactEventTimelineInfo\n  }\n  ... on RemovedAssignmentEvent {\n    ...RemovedAssignmentEventTimelineInfo\n  }\n  ... on RemovedFromPinnedIssuesEvent {\n    ...RemovedFromPinnedIssuesEventTimelineInfo\n  }\n  ... on RemovedFromTrackableEvent {\n    ...RemovedFromTrackableEventTimelineInfo\n  }\n  ... on RemovedIncomingRelationEvent {\n    ...RemovedIncomingRelationEventTimelineInfo\n  }\n  ... on RemovedLabelEvent {\n    ...RemovedLabelEventTimelineInfo\n  }\n  ... on RemovedOutgoingRelationEvent {\n    ...RemovedOutgoingRelationEventTimelineInfo\n  }\n  ... on RemovedTemplatedFieldEvent {\n    ...RemovedTemplatedFieldEventTimelineInfo\n  }\n  ... on StateChangedEvent {\n    ...StateChangedEventTimelineInfo\n  }\n  ... on TemplateChangedEvent {\n    ...TemplateChangedEventTimelineInfo\n  }\n  ... on TemplatedFieldChangedEvent {\n    ...TemplatedFieldChangedEventTimelineInfo\n  }\n  ... on TitleChangedEvent {\n    ...TitleChangedEventTimelineInfo\n  }\n  ... on TypeChangedEvent {\n    ...TypeChangedEventTimelineInfo\n  }\n}\n\nfragment TimelineItemInfo on TimelineItem {\n  id\n  createdAt\n  __typename\n  createdBy {\n    ...UserTimelineInfo\n  }\n}\n\nfragment AddedAffectedEntityEventTimelineInfo on AddedAffectedEntityEvent {\n  ...TimelineItemInfo\n  addedAffectedEntity {\n    ...AffectedByIssueTimelineInfo\n  }\n}\n\nfragment AddedArtefactEventTimelineInfo on AddedArtefactEvent {\n  ...TimelineItemInfo\n  addedArtefact {\n    ...ArtefactTimelineInfo\n  }\n}\n\nfragment AddedLabelEventTimelineInfo on AddedLabelEvent {\n  ...TimelineItemInfo\n  addedLabel {\n    ...LabelTimelineInfo\n  }\n}\n\nfragment AddedToPinnedIssuesEventTimelineInfo on AddedToPinnedIssuesEvent {\n  ...TimelineItemInfo\n  pinnedOn {\n    ...TrackableTimelineInfo\n  }\n}\n\nfragment AddedToTrackableEventTimelineInfo on AddedToTrackableEvent {\n  ...TimelineItemInfo\n  addedToTrackable {\n    ...TrackableTimelineInfo\n  }\n}\n\nfragment AssignmentTimelineInfo on Assignment {\n  ...TimelineItemInfo\n  ...DefaultAssignmentInfo\n  initialType {\n    ...AssignmentTypeTimelineInfo\n  }\n}\n\nfragment AssignmentTypeChangedEventTimelineInfo on AssignmentTypeChangedEvent {\n  ...TimelineItemInfo\n  assignment {\n    ...AssignmentTimelineInfo\n  }\n  newAssignmentType: newType {\n    ...AssignmentTypeTimelineInfo\n  }\n  oldAssignmentType: oldType {\n    ...AssignmentTypeTimelineInfo\n  }\n}\n\nfragment BodyTimelineInfo on Body {\n  ...TimelineItemInfo\n  ...CommentTimelineInfo\n}\n\nfragment IncomingRelationTypeChangedEventTimelineInfo on IncomingRelationTypeChangedEvent {\n  ...RelationTypeChangedEventTimelineInfo\n  issueRelation {\n    ...IncomingRelationTimelineInfo\n  }\n}\n\nfragment IssueCommentTimelineInfo on IssueComment {\n  ...TimelineItemInfo\n  ...CommentTimelineInfo\n  isDeleted\n  answers {\n    id\n  }\n}\n\nfragment IssueRelationTimelineInfo on IssueRelation {\n  ...TimelineItemInfo\n  ...OutgoingRelationTimelineInfo\n}\n\nfragment OutgoingRelationTypeChangedEventTimelineInfo on OutgoingRelationTypeChangedEvent {\n  ...RelationTypeChangedEventTimelineInfo\n  issueRelation {\n    ...OutgoingRelationTimelineInfo\n  }\n}\n\nfragment PriorityChangedEventTimelineInfo on PriorityChangedEvent {\n  ...TimelineItemInfo\n  oldPriority {\n    ...IssuePriorityTimelineInfo\n  }\n  newPriority {\n    ...IssuePriorityTimelineInfo\n  }\n}\n\nfragment RelatedByIssueEventTimelineInfo on RelatedByIssueEvent {\n  ...TimelineItemInfo\n  relation {\n    ...IncomingRelationTimelineInfo\n  }\n}\n\nfragment RelationTypeChangedEventTimelineInfo on RelationTypeChangedEvent {\n  ...TimelineItemInfo\n  oldRelationType: oldType {\n    ...IssueRelationTypeTimelineInfo\n  }\n  newRelationType: newType {\n    ...IssueRelationTypeTimelineInfo\n  }\n}\n\nfragment RemovedAffectedEntityEventTimelineInfo on RemovedAffectedEntityEvent {\n  ...TimelineItemInfo\n  removedAffectedEntity {\n    ...AffectedByIssueTimelineInfo\n  }\n}\n\nfragment RemovedArtefactEventTimelineInfo on RemovedArtefactEvent {\n  ...TimelineItemInfo\n  removedArtefact {\n    ...ArtefactTimelineInfo\n  }\n}\n\nfragment RemovedAssignmentEventTimelineInfo on RemovedAssignmentEvent {\n  ...TimelineItemInfo\n  removedAssignment {\n    ...AssignmentTimelineInfo\n  }\n}\n\nfragment RemovedFromPinnedIssuesEventTimelineInfo on RemovedFromPinnedIssuesEvent {\n  ...TimelineItemInfo\n  unpinnedOn {\n    ...TrackableTimelineInfo\n  }\n}\n\nfragment RemovedFromTrackableEventTimelineInfo on RemovedFromTrackableEvent {\n  ...TimelineItemInfo\n  removedFromTrackable {\n    ...TrackableTimelineInfo\n  }\n}\n\nfragment RemovedIncomingRelationEventTimelineInfo on RemovedIncomingRelationEvent {\n  ...TimelineItemInfo\n  removedRelation {\n    ...IncomingRelationTimelineInfo\n  }\n}\n\nfragment RemovedLabelEventTimelineInfo on RemovedLabelEvent {\n  ...TimelineItemInfo\n  removedLabel {\n    ...LabelTimelineInfo\n  }\n}\n\nfragment RemovedOutgoingRelationEventTimelineInfo on RemovedOutgoingRelationEvent {\n  ...TimelineItemInfo\n  removedRelation {\n    ...OutgoingRelationTimelineInfo\n  }\n}\n\nfragment RemovedTemplatedFieldEventTimelineInfo on RemovedTemplatedFieldEvent {\n  ...TimelineItemInfo\n  fieldName\n}\n\nfragment StateChangedEventTimelineInfo on StateChangedEvent {\n  ...TimelineItemInfo\n  oldState {\n    ...IssueStateTimelineInfo\n  }\n  newState {\n    ...IssueStateTimelineInfo\n  }\n}\n\nfragment TemplateChangedEventTimelineInfo on TemplateChangedEvent {\n  ...TimelineItemInfo\n  oldTemplate {\n    ...IssueTemplateTimelineInfo\n  }\n  newTemplate {\n    ...IssueTemplateTimelineInfo\n  }\n}\n\nfragment TemplatedFieldChangedEventTimelineInfo on TemplatedFieldChangedEvent {\n  ...TimelineItemInfo\n  fieldName\n  oldValue\n  newValue\n}\n\nfragment TitleChangedEventTimelineInfo on TitleChangedEvent {\n  ...TimelineItemInfo\n  oldTitle\n  newTitle\n}\n\nfragment TypeChangedEventTimelineInfo on TypeChangedEvent {\n  ...TimelineItemInfo\n  newIssueType: newType {\n    ...IssueTypeTimelineInfo\n  }\n  oldIssueType: oldType {\n    ...IssueTypeTimelineInfo\n  }\n}\n\nfragment IssueTypeTimelineInfo on IssueType {\n  ...DefaultIssueTypeInfo\n}\n\nfragment AffectedByIssueTimelineInfo on AffectedByIssue {\n  ...DefaultAffectedByIssueInfo\n}\n\nfragment ArtefactTimelineInfo on Artefact {\n  file\n  id\n}\n\nfragment UserTimelineInfo on User {\n  ...DefaultUserInfo\n}\n\nfragment LabelTimelineInfo on Label {\n  ...DefaultLabelInfo\n}\n\nfragment TrackableTimelineInfo on Trackable {\n  ...DefaultTrackableInfo\n}\n\nfragment AssignmentTypeTimelineInfo on AssignmentType {\n  ...DefaultAssignmentTypeInfo\n}\n\nfragment CommentTimelineInfo on Comment {\n  body\n  bodyLastEditedAt\n  bodyLastEditedBy {\n    ...UserTimelineInfo\n  }\n}\n\nfragment IssueRelationTypeTimelineInfo on IssueRelationType {\n  id\n  name\n  inverseName\n  description\n}\n\nfragment IssueRelationTimelineInfoBase on IssueRelation {\n  type {\n    ...IssueRelationTypeTimelineInfo\n  }\n  initialType {\n    ...IssueRelationTypeTimelineInfo\n  }\n}\n\nfragment IncomingRelationTimelineInfo on IssueRelation {\n  id\n  ...IssueRelationTimelineInfoBase\n  issue {\n    ...IssueTimelineInfo\n  }\n}\n\nfragment OutgoingRelationTimelineInfo on IssueRelation {\n  id\n  ...IssueRelationTimelineInfoBase\n  relatedIssue {\n    ...IssueTimelineInfo\n  }\n}\n\nfragment IssueTimelineInfo on Issue {\n  ...DefaultIssueInfo\n}\n\nfragment IssuePriorityTimelineInfo on IssuePriority {\n  ...DefaultIssuePriorityInfo\n}\n\nfragment IssueStateTimelineInfo on IssueState {\n  ...DefaultIssueStateInfo\n}\n\nfragment IssueTemplateTimelineInfo on IssueTemplate {\n  name\n  description\n}": typeof types.DefaultTimelineItemInfoFragmentDoc;
    "fragment OpenIssueCount on Trackable {\n  openIssues: issues(filter: {state: {isOpen: {eq: true}}}) {\n    totalCount\n  }\n}\n\nfragment DefaultTrackableInfo on Trackable {\n  __typename\n  id\n  name\n  description\n}": typeof types.OpenIssueCountFragmentDoc;
    "fragment DefaultUserInfo on User {\n  id\n  username\n  displayName\n  avatar\n}\n\nfragment CurrentUserInfo on User {\n  ...DefaultUserInfo\n  email\n  ... on GropiusUser {\n    isAdmin\n  }\n}": typeof types.DefaultUserInfoFragmentDoc;
    "fragment DefaultViewInfo on View {\n  id\n  name\n  description\n  filterByTemplate {\n    nodes {\n      id\n      name\n    }\n  }\n}\n\nfragment ViewGraphInfo on View {\n  ...DefaultViewInfo\n  relationLayouts {\n    nodes {\n      relation {\n        id\n      }\n      points {\n        x\n        y\n      }\n    }\n  }\n  relationPartnerLayouts {\n    nodes {\n      relationPartner {\n        id\n      }\n      pos {\n        x\n        y\n      }\n    }\n  }\n}": typeof types.DefaultViewInfoFragmentDoc;
    "\n    query getCurrentUser {\n        currentUser {\n            ...CurrentUserInfo\n        }\n\n        canCreateProjects: hasGlobalPermission(permission: CAN_CREATE_PROJECTS)\n        canCreateComponents: hasGlobalPermission(permission: CAN_CREATE_COMPONENTS)\n        canCreateIMSs: hasGlobalPermission(permission: CAN_CREATE_IMSS)\n        canCreateTemplates: hasGlobalPermission(permission: CAN_CREATE_TEMPLATES)\n    }\n": typeof types.GetCurrentUserDocument;
    "\n    query legalInformation {\n        legalInformation(orderBy: [{ field: PRIORITY, direction: ASC }]) {\n            nodes {\n                ...BaseLegalInformationInfo\n            }\n        }\n    }\n": typeof types.LegalInformationDocument;
    "\n    query getLegalInformation($id: ID!) {\n        node(id: $id) {\n            __typename\n            ... on LegalInformation {\n                ...DefaultLegalInformationInfo\n            }\n        }\n    }\n": typeof types.GetLegalInformationDocument;
    "\n    query getUser($id: ID!) {\n        node(id: $id) {\n            ... on User {\n                ...DefaultUserInfo\n            }\n        }\n    }\n": typeof types.GetUserDocument;
    "\n    query getLegalInformationList($orderBy: [LegalInformationOrder!], $count: Int!, $skip: Int!) {\n        legalInformation(orderBy: $orderBy, first: $count, skip: $skip) {\n            nodes {\n                ...DefaultLegalInformationInfo\n            }\n            totalCount\n        }\n    }\n": typeof types.GetLegalInformationListDocument;
    "\n    query getFilteredLegalInformationList($query: String!, $count: Int!) {\n        searchLegalInformation(query: $query, first: $count) {\n            ...DefaultLegalInformationInfo\n        }\n    }\n": typeof types.GetFilteredLegalInformationListDocument;
    "\n    mutation deleteLegalInformation($id: ID!) {\n        deleteLegalInformation(input: { id: $id }) {\n            __typename\n        }\n    }\n": typeof types.DeleteLegalInformationDocument;
    "\n    query getGlobalPermissionList(\n        $orderBy: [GlobalPermissionOrder!]!\n        $count: Int!\n        $skip: Int!\n        $filter: GlobalPermissionFilterInput\n    ) {\n        globalPermissions(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n            nodes {\n                ...DefaultGlobalPermissionInfo\n            }\n            totalCount\n        }\n    }\n": typeof types.GetGlobalPermissionListDocument;
    "\n    query getFilteredGlobalPermissionList($query: String!, $count: Int!, $filter: GlobalPermissionFilterInput!) {\n        searchGlobalPermissions(query: $query, first: $count, filter: $filter) {\n            ...DefaultGlobalPermissionInfo\n        }\n    }\n": typeof types.GetFilteredGlobalPermissionListDocument;
    "\n    mutation deleteGlobalPermission($globalPermission: ID!) {\n        deleteGlobalPermission(input: { id: $globalPermission }) {\n            __typename\n        }\n    }\n": typeof types.DeleteGlobalPermissionDocument;
    "\n    mutation updateGlobalPermission($input: UpdateGlobalPermissionInput!) {\n        updateGlobalPermission(input: $input) {\n            __typename\n        }\n    }\n": typeof types.UpdateGlobalPermissionDocument;
    "\n    mutation createGlobalPermission($input: CreateGlobalPermissionInput!) {\n        createGlobalPermission(input: $input) {\n            globalPermission {\n                id\n            }\n        }\n    }\n": typeof types.CreateGlobalPermissionDocument;
    "\n    query getComponentDetails($id: ID!) {\n        node(id: $id) {\n            id\n            ... on Component {\n                name\n                description\n                issues(orderBy: [{ field: LAST_UPDATED_AT, direction: DESC }], first: 20) {\n                    nodes {\n                        ...IssueListItemInfo\n                    }\n                }\n                pinnedIssues {\n                    nodes {\n                        ...IssueListItemInfo\n                    }\n                }\n            }\n        }\n    }\n": typeof types.GetComponentDetailsDocument;
    "\n    query getComponent($id: ID!) {\n        node(id: $id) {\n            id\n            ... on Component {\n                __typename\n                name\n                description\n                ...OpenIssueCount\n                createIssues: hasPermission(permission: CREATE_ISSUES)\n                manageLabels: hasPermission(permission: MANAGE_LABELS)\n                manageIssues: hasPermission(permission: MANAGE_ISSUES)\n                manageIMS: hasPermission(permission: MANAGE_IMS)\n                admin: hasPermission(permission: ADMIN)\n            }\n        }\n    }\n": typeof types.GetComponentDocument;
    "\n    query getVersionedNode($id: ID!) {\n        node(id: $id) {\n            id\n            ... on Versioned {\n                version\n            }\n        }\n    }\n": typeof types.GetVersionedNodeDocument;
    "\n    query getNamedNodeComponent($id: ID!) {\n        node(id: $id) {\n            id\n            ... on Named {\n                name\n            }\n        }\n    }\n": typeof types.GetNamedNodeComponentDocument;
    "\n    mutation deleteComponent($id: ID!) {\n        deleteComponent(input: { id: $id }) {\n            __typename\n        }\n    }\n": typeof types.DeleteComponentDocument;
    "\n    query getComponentGeneralDetails($id: ID!) {\n        node(id: $id) {\n            id\n            ... on Component {\n                name\n                description\n                repositoryURL\n                templatedFields {\n                    name\n                    value\n                }\n                template {\n                    templateFieldSpecifications {\n                        name\n                        value\n                    }\n                }\n                admin: hasPermission(permission: ADMIN)\n            }\n        }\n    }\n": typeof types.GetComponentGeneralDetailsDocument;
    "\n    mutation updateComponent($input: UpdateComponentInput!) {\n        updateComponent(input: $input) {\n            component {\n                id\n            }\n        }\n    }\n": typeof types.UpdateComponentDocument;
    "\n    query getComponentTemplateDetails($id: ID!) {\n        node(id: $id) {\n            id\n            ... on Component {\n                template {\n                    id\n                }\n            }\n        }\n    }\n": typeof types.GetComponentTemplateDetailsDocument;
    "\n    query getInterfaceSpecificationList(\n        $orderBy: [InterfaceSpecificationOrder!]!\n        $count: Int!\n        $skip: Int!\n        $component: ID!\n        $filter: InterfaceSpecificationFilterInput!\n    ) {\n        node(id: $component) {\n            ... on Component {\n                interfaceSpecifications(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n                    nodes {\n                        ...InterfaceSpecificationListItemInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n": typeof types.GetInterfaceSpecificationListDocument;
    "\n    query getFilteredInterfaceSpecificationList(\n        $query: String!\n        $count: Int!\n        $filter: InterfaceSpecificationFilterInput!\n    ) {\n        searchInterfaceSpecifications(query: $query, first: $count, filter: $filter) {\n            ...InterfaceSpecificationListItemInfo\n        }\n    }\n": typeof types.GetFilteredInterfaceSpecificationListDocument;
    "\n    query searchInterfaceSpecificationTemplatesForComponentInterfaces($query: String!, $count: Int!) {\n        searchInterfaceSpecificationTemplates(query: $query, first: $count) {\n            id\n            name\n            description\n        }\n    }\n": typeof types.SearchInterfaceSpecificationTemplatesForComponentInterfacesDocument;
    "\n    query getComponentPermissionList(\n        $orderBy: [ComponentPermissionOrder!]!\n        $count: Int!\n        $skip: Int!\n        $component: ID!\n        $filter: ComponentPermissionFilterInput!\n    ) {\n        node(id: $component) {\n            ... on Component {\n                permissions(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n                    nodes {\n                        ...DefaultComponentPermissionInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n": typeof types.GetComponentPermissionListDocument;
    "\n    query getFilteredComponentPermissionList($query: String!, $count: Int!, $filter: ComponentPermissionFilterInput!) {\n        searchComponentPermissions(query: $query, first: $count, filter: $filter) {\n            ...DefaultComponentPermissionInfo\n        }\n    }\n": typeof types.GetFilteredComponentPermissionListDocument;
    "\n    mutation removeComponentPermissionFromComponent($component: ID!, $componentPermission: ID!) {\n        updateComponent(input: { id: $component, removedPermissions: [$componentPermission] }) {\n            __typename\n        }\n    }\n": typeof types.RemoveComponentPermissionFromComponentDocument;
    "\n    mutation updateComponentPermission($input: UpdateComponentPermissionInput!) {\n        updateComponentPermission(input: $input) {\n            __typename\n        }\n    }\n": typeof types.UpdateComponentPermissionDocument;
    "\n    mutation createComponentPermission($input: CreateComponentPermissionInput!) {\n        createComponentPermission(input: $input) {\n            componentPermission {\n                id\n            }\n        }\n    }\n": typeof types.CreateComponentPermissionDocument;
    "\n    mutation deleteInterfaceSpecification($id: ID!) {\n        deleteInterfaceSpecification(input: { id: $id }) {\n            __typename\n        }\n    }\n": typeof types.DeleteInterfaceSpecificationDocument;
    "\n    query getInterfaceSpecificationGeneralDetails($id: ID!) {\n        node(id: $id) {\n            id\n            ... on InterfaceSpecification {\n                name\n                description\n                templatedFields {\n                    name\n                    value\n                }\n                template {\n                    templateFieldSpecifications {\n                        name\n                        value\n                    }\n                }\n            }\n        }\n    }\n": typeof types.GetInterfaceSpecificationGeneralDetailsDocument;
    "\n    mutation updateInterfaceSpecification($input: UpdateInterfaceSpecificationInput!) {\n        updateInterfaceSpecification(input: $input) {\n            interfaceSpecification {\n                id\n            }\n        }\n    }\n": typeof types.UpdateInterfaceSpecificationDocument;
    "\n    mutation deleteInterfaceSpecificationVersion($id: ID!) {\n        deleteInterfaceSpecificationVersion(input: { id: $id }) {\n            __typename\n        }\n    }\n": typeof types.DeleteInterfaceSpecificationVersionDocument;
    "\n    query getInterfaceSpecificationVersionGeneralDetails($id: ID!) {\n        node(id: $id) {\n            id\n            ... on InterfaceSpecificationVersion {\n                version\n                tags\n                templatedFields {\n                    name\n                    value\n                }\n                template {\n                    templateFieldSpecifications {\n                        name\n                        value\n                    }\n                }\n            }\n        }\n    }\n": typeof types.GetInterfaceSpecificationVersionGeneralDetailsDocument;
    "\n    mutation updateInterfaceSpecificationVersion($input: UpdateInterfaceSpecificationVersionInput!) {\n        updateInterfaceSpecificationVersion(input: $input) {\n            interfaceSpecificationVersion {\n                id\n            }\n        }\n    }\n": typeof types.UpdateInterfaceSpecificationVersionDocument;
    "\n    query getInterfaceSpecificationVersionList(\n        $orderBy: [InterfaceSpecificationVersionOrder!]!\n        $count: Int!\n        $skip: Int!\n        $interfaceSpecification: ID!\n    ) {\n        node(id: $interfaceSpecification) {\n            ... on InterfaceSpecification {\n                versions(orderBy: $orderBy, first: $count, skip: $skip) {\n                    nodes {\n                        ...InterfaceSpecificationVersionListItemInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n": typeof types.GetInterfaceSpecificationVersionListDocument;
    "\n    query getFilteredInterfaceSpecificationVersionList($query: String!, $count: Int!, $interfaceSpecification: ID!) {\n        searchInterfaceSpecificationVersions(\n            query: $query\n            first: $count\n            filter: { interfaceSpecification: { id: { eq: $interfaceSpecification } } }\n        ) {\n            ...InterfaceSpecificationVersionListItemInfo\n        }\n    }\n": typeof types.GetFilteredInterfaceSpecificationVersionListDocument;
    "\n    mutation deleteComponentVersion($id: ID!) {\n        deleteComponentVersion(input: { id: $id }) {\n            __typename\n        }\n    }\n": typeof types.DeleteComponentVersionDocument;
    "\n    query getComponentVersionGeneralDetails($id: ID!) {\n        node(id: $id) {\n            id\n            ... on ComponentVersion {\n                version\n                tags\n                templatedFields {\n                    name\n                    value\n                }\n                template {\n                    templateFieldSpecifications {\n                        name\n                        value\n                    }\n                }\n            }\n        }\n    }\n": typeof types.GetComponentVersionGeneralDetailsDocument;
    "\n    mutation updateComponentVersion($input: UpdateComponentVersionInput!) {\n        updateComponentVersion(input: $input) {\n            componentVersion {\n                id\n            }\n        }\n    }\n": typeof types.UpdateComponentVersionDocument;
    "\n    query getInterfaceDefinitionList(\n        $orderBy: [InterfaceDefinitionOrder!]!\n        $count: Int!\n        $skip: Int!\n        $componentVersion: ID!\n        $filter: InterfaceDefinitionFilterInput!\n    ) {\n        node(id: $componentVersion) {\n            ... on ComponentVersion {\n                interfaceDefinitions(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n                    nodes {\n                        ...DefaultInterfaceDefinitionInfo\n                        interfaceSpecificationVersion {\n                            id\n                            version\n                            interfaceSpecification {\n                                id\n                                name\n                                description\n                                template {\n                                    id\n                                    name\n                                    description\n                                }\n                            }\n                        }\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n": typeof types.GetInterfaceDefinitionListDocument;
    "\n    query getFilteredInterfaceDefinitionList(\n        $query: String!\n        $count: Int!\n        $specificationFilter: InterfaceSpecificationFilterInput!\n        $versionFilter: InterfaceSpecificationVersionFilterInput!\n        $definitionFilter: InterfaceDefinitionFilterInput!\n    ) {\n        searchInterfaceSpecifications(query: $query, first: $count, filter: $specificationFilter) {\n            id\n            name\n            description\n            template {\n                id\n                name\n                description\n            }\n            versions(filter: $versionFilter, first: $count) {\n                nodes {\n                    id\n                    version\n                    interfaceDefinitions(filter: $definitionFilter) {\n                        nodes {\n                            ...DefaultInterfaceDefinitionInfo\n                        }\n                    }\n                }\n            }\n        }\n    }\n": typeof types.GetFilteredInterfaceDefinitionListDocument;
    "\n    query searchInterfaceSpecificationsForVersionInterfaces($query: String!, $count: Int!, $component: ID!) {\n        searchInterfaceSpecifications(query: $query, first: $count, filter: { component: { id: { eq: $component } } }) {\n            id\n            name\n            description\n        }\n    }\n": typeof types.SearchInterfaceSpecificationsForVersionInterfacesDocument;
    "\n    query searchInterfaceSpecificationTemplatesForVersionInterfaces($query: String!, $count: Int!) {\n        searchInterfaceSpecificationTemplates(query: $query, first: $count) {\n            id\n            name\n            description\n        }\n    }\n": typeof types.SearchInterfaceSpecificationTemplatesForVersionInterfacesDocument;
    "\n    mutation removeInterfaceSpecificationVersionFromComponentVersion(\n        $input: RemoveInterfaceSpecificationVersionFromComponentVersionInput!\n    ) {\n        removeInterfaceSpecificationVersionFromComponentVersion(input: $input) {\n            __typename\n        }\n    }\n": typeof types.RemoveInterfaceSpecificationVersionFromComponentVersionDocument;
    "\n    query getComponentVersionList($orderBy: [ComponentVersionOrder!]!, $count: Int!, $skip: Int!, $component: ID!) {\n        node(id: $component) {\n            ... on Component {\n                versions(orderBy: $orderBy, first: $count, skip: $skip) {\n                    nodes {\n                        ...ComponentVersionListItemInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n": typeof types.GetComponentVersionListDocument;
    "\n    query getFilteredComponentVersionList($query: String!, $count: Int!, $component: ID!) {\n        searchComponentVersions(query: $query, first: $count, filter: { component: { id: { eq: $component } } }) {\n            ...ComponentVersionListItemInfo\n        }\n    }\n": typeof types.GetFilteredComponentVersionListDocument;
    "\n    query getComponentList($orderBy: [ComponentOrder!]!, $count: Int!, $skip: Int!, $filter: ComponentFilterInput!) {\n        components(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n            nodes {\n                ...ComponentListItemInfo\n            }\n            totalCount\n        }\n    }\n": typeof types.GetComponentListDocument;
    "\n    query getFilteredComponentList($query: String!, $count: Int!, $filter: ComponentFilterInput!) {\n        searchComponents(query: $query, first: $count, filter: $filter) {\n            ...ComponentListItemInfo\n        }\n    }\n": typeof types.GetFilteredComponentListDocument;
    "\n    query searchComponentTemplates($query: String!, $count: Int!) {\n        searchComponentTemplates(query: $query, first: $count) {\n            id\n            name\n        }\n    }\n": typeof types.SearchComponentTemplatesDocument;
    "\n    query getParticipatingIssueList($orderBy: [IssueOrder!]!, $count: Int!, $skip: Int!, $filter: IssueFilterInput) {\n        currentUser {\n            participatedIssues(filter: $filter, orderBy: $orderBy, first: $count, skip: $skip) {\n                nodes {\n                    ...ParticipatingIssueListItemInfo\n                }\n                totalCount\n            }\n        }\n    }\n": typeof types.GetParticipatingIssueListDocument;
    "\n    query getParticipatingFilteredIssueList($query: String!, $count: Int!, $filter: IssueFilterInput) {\n        searchIssues(query: $query, first: $count, filter: $filter) {\n            ...ParticipatingIssueListItemInfo\n        }\n    }\n": typeof types.GetParticipatingFilteredIssueListDocument;
    "\n    query getIMSList($orderBy: [IMSOrder!]!, $count: Int!, $skip: Int!, $filter: IMSFilterInput!) {\n        imss(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n            nodes {\n                ...IMSListItemInfo\n            }\n            totalCount\n        }\n    }\n": typeof types.GetImsListDocument;
    "\n    query getFilteredIMSList($query: String!, $count: Int!, $filter: IMSFilterInput) {\n        searchIMSs(query: $query, first: $count, filter: $filter) {\n            ...IMSListItemInfo\n        }\n    }\n": typeof types.GetFilteredImsListDocument;
    "\n    query searchIMSTemplates($query: String!, $count: Int!) {\n        searchIMSTemplates(query: $query, first: $count) {\n            id\n            name\n        }\n    }\n": typeof types.SearchImsTemplatesDocument;
    "\n    query getProjectList($orderBy: [ProjectOrder!]!, $count: Int!, $skip: Int!) {\n        projects(orderBy: $orderBy, first: $count, skip: $skip) {\n            nodes {\n                ...ProjectListItemInfo\n            }\n            totalCount\n        }\n    }\n": typeof types.GetProjectListDocument;
    "\n    query getFilteredProjectList($query: String!, $count: Int!) {\n        searchProjects(query: $query, first: $count) {\n            ...ProjectListItemInfo\n        }\n    }\n": typeof types.GetFilteredProjectListDocument;
    "\n    query getIssueTemplateList($orderBy: [IssueTemplateOrder!]!, $count: Int!, $skip: Int!, $isDeprecated: Boolean!) {\n        issueTemplates(orderBy: $orderBy, first: $count, skip: $skip, filter: { isDeprecated: { eq: $isDeprecated } }) {\n            nodes {\n                ...DefaultIssueTemplateInfo\n            }\n            totalCount\n        }\n    }\n": typeof types.GetIssueTemplateListDocument;
    "\n    query getFilteredIssueTemplateList($query: String!, $count: Int!, $isDeprecated: Boolean!) {\n        searchIssueTemplates(query: $query, first: $count, filter: { isDeprecated: { eq: $isDeprecated } }) {\n            ...DefaultIssueTemplateInfo\n        }\n    }\n": typeof types.GetFilteredIssueTemplateListDocument;
    "\n    query getIssueTemplateDeprecationStatus($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on IssueTemplate {\n                isDeprecated\n            }\n        }\n    }\n": typeof types.GetIssueTemplateDeprecationStatusDocument;
    "\n    mutation updateIssueTemplateDeprecationStatus($id: ID!, $isDeprecated: Boolean!) {\n        updateTemplateDeprecationStatus(input: { id: $id, isDeprecated: $isDeprecated }) {\n            template {\n                id\n                isDeprecated\n            }\n        }\n    }\n": typeof types.UpdateIssueTemplateDeprecationStatusDocument;
    "\n    query getIssueTemplateGeneralDetails($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on IssueTemplate {\n                name\n                description\n                isDeprecated\n            }\n        }\n    }\n": typeof types.GetIssueTemplateGeneralDetailsDocument;
    "\n    mutation updateIssueTemplate($input: UpdateIssueTemplateInput!) {\n        updateIssueTemplate(input: $input) {\n            issueTemplate {\n                id\n            }\n        }\n    }\n": typeof types.UpdateIssueTemplateDocument;
    "\n    query getIssueTemplateIssueAttributes($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on IssueTemplate {\n                issueTypes {\n                    nodes {\n                        id\n                        name\n                        description\n                        iconPath\n                        partOf {\n                            totalCount\n                        }\n                    }\n                }\n                issuePriorities {\n                    nodes {\n                        id\n                        name\n                        description\n                        value\n                        iconPath\n                        partOf {\n                            totalCount\n                        }\n                    }\n                }\n                issueStates {\n                    nodes {\n                        id\n                        name\n                        description\n                        isOpen\n                        partOf {\n                            totalCount\n                        }\n                    }\n                }\n            }\n        }\n    }\n": typeof types.GetIssueTemplateIssueAttributesDocument;
    "\n    query getIssueTemplateLinkageAttributes($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on IssueTemplate {\n                assignmentTypes {\n                    nodes {\n                        id\n                        name\n                        description\n                        partOf {\n                            totalCount\n                        }\n                    }\n                }\n                relationTypes {\n                    nodes {\n                        id\n                        name\n                        description\n                        inverseName\n                        partOf {\n                            totalCount\n                        }\n                    }\n                }\n            }\n        }\n    }\n": typeof types.GetIssueTemplateLinkageAttributesDocument;
    "\n    query getIssueTemplate($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on IssueTemplate {\n                name\n                description\n            }\n        }\n    }\n": typeof types.GetIssueTemplateDocument;
    "\n    query getIssueTemplateFieldSpecifications($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on IssueTemplate {\n                templateFieldSpecifications {\n                    name\n                    value\n                }\n            }\n        }\n    }\n": typeof types.GetIssueTemplateFieldSpecificationsDocument;
    "\n    query getIMS($id: ID!) {\n        node(id: $id) {\n            __typename\n            ... on IMS {\n                name\n                description\n                syncTrackables: hasPermission(permission: SYNC_TRACKABLES)\n                admin: hasPermission(permission: ADMIN)\n            }\n        }\n    }\n": typeof types.GetImsDocument;
    "\n    query getNamedNode($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on Named {\n                name\n            }\n        }\n    }\n": typeof types.GetNamedNodeDocument;
    "\n    mutation deleteIMS($id: ID!) {\n        deleteIMS(input: { id: $id }) {\n            __typename\n        }\n    }\n": typeof types.DeleteImsDocument;
    "\n    query getIMSGeneralDetails($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on IMS {\n                name\n                description\n                templatedFields {\n                    name\n                    value\n                }\n                template {\n                    templateFieldSpecifications {\n                        name\n                        value\n                    }\n                }\n                admin: hasPermission(permission: ADMIN)\n            }\n        }\n    }\n": typeof types.GetImsGeneralDetailsDocument;
    "\n    mutation updateIMS($input: UpdateIMSInput!) {\n        updateIMS(input: $input) {\n            ims {\n                id\n            }\n        }\n    }\n": typeof types.UpdateImsDocument;
    "\n    query getIMSPermissionList(\n        $orderBy: [IMSPermissionOrder!]!\n        $count: Int!\n        $skip: Int!\n        $ims: ID!\n        $filter: IMSPermissionFilterInput!\n    ) {\n        node(id: $ims) {\n            __typename\n            ... on IMS {\n                permissions(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n                    nodes {\n                        ...DefaultIMSPermissionInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n": typeof types.GetImsPermissionListDocument;
    "\n    query getFilteredIMSPermissionList($query: String!, $count: Int!, $filter: IMSPermissionFilterInput!) {\n        searchIMSPermissions(query: $query, first: $count, filter: $filter) {\n            ...DefaultIMSPermissionInfo\n        }\n    }\n": typeof types.GetFilteredImsPermissionListDocument;
    "\n    mutation removeIMSPermissionFromIMS($ims: ID!, $imsPermission: ID!) {\n        updateIMS(input: { id: $ims, removedPermissions: [$imsPermission] }) {\n            __typename\n        }\n    }\n": typeof types.RemoveImsPermissionFromImsDocument;
    "\n    mutation updateIMSPermission($input: UpdateIMSPermissionInput!) {\n        updateIMSPermission(input: $input) {\n            __typename\n        }\n    }\n": typeof types.UpdateImsPermissionDocument;
    "\n    mutation createIMSPermission($input: CreateIMSPermissionInput!) {\n        createIMSPermission(input: $input) {\n            imsPermission {\n                id\n            }\n        }\n    }\n": typeof types.CreateImsPermissionDocument;
    "\n    mutation deleteIMSProject($id: ID!) {\n        deleteIMSProject(input: { id: $id }) {\n            __typename\n        }\n    }\n": typeof types.DeleteImsProjectDocument;
    "\n    query getIMSProjectGeneralDetails($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on IMSProject {\n                name\n                description\n                templatedFields {\n                    name\n                    value\n                }\n                template {\n                    templateFieldSpecifications {\n                        name\n                        value\n                    }\n                }\n                ims {\n                    syncTrackables: hasPermission(permission: SYNC_TRACKABLES)\n                }\n                trackable {\n                    manageIMS: hasPermission(permission: MANAGE_IMS)\n                }\n            }\n        }\n    }\n": typeof types.GetImsProjectGeneralDetailsDocument;
    "\n    mutation updateIMSProject($input: UpdateIMSProjectInput!) {\n        updateIMSProject(input: $input) {\n            imsProject {\n                id\n            }\n        }\n    }\n": typeof types.UpdateImsProjectDocument;
    "\n    query getIMSProjectListFromIMS($orderBy: [IMSProjectOrder!]!, $count: Int!, $skip: Int!, $ims: ID!) {\n        node(id: $ims) {\n            __typename\n            ... on IMS {\n                projects(orderBy: $orderBy, first: $count, skip: $skip) {\n                    nodes {\n                        ...DefaultIMSProjectInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n": typeof types.GetImsProjectListFromImsDocument;
    "\n    query getFilteredIMSProjectList($query: String!, $count: Int!, $filter: IMSProjectFilterInput!) {\n        searchIMSProjects(query: $query, first: $count, filter: $filter) {\n            ...DefaultIMSProjectInfo\n        }\n    }\n": typeof types.GetFilteredImsProjectListDocument;
    "\n    query getIssue($id: ID!) {\n        node(id: $id) {\n            __typename\n            ... on Issue {\n                id\n                title\n                createdBy {\n                    ...DefaultUserInfo\n                }\n                createdAt\n                lastUpdatedAt\n                timelineItems(orderBy: [{ field: CREATED_AT }]) {\n                    nodes {\n                        ...DefaultTimelineItemInfo\n                    }\n                }\n                artefacts {\n                    nodes {\n                        ...ArtefactTimelineInfo\n                    }\n                }\n                outgoingRelations {\n                    nodes {\n                        id\n                        ...OutgoingRelationTimelineInfo\n                    }\n                    totalCount\n                }\n                incomingRelations {\n                    nodes {\n                        id\n                        ...IncomingRelationTimelineInfo\n                    }\n                    totalCount\n                }\n                labels {\n                    nodes {\n                        ...DefaultLabelInfo\n                    }\n                }\n                affects {\n                    nodes {\n                        ...AffectedByIssueTimelineInfo\n                    }\n                }\n                assignments {\n                    nodes {\n                        ...AssignmentTimelineInfo\n                    }\n                }\n                type {\n                    ...DefaultIssueTypeInfo\n                }\n                state {\n                    ...DefaultIssueStateInfo\n                }\n                priority {\n                    ...DefaultIssuePriorityInfo\n                }\n                trackables {\n                    nodes {\n                        ...DefaultTrackableInfo\n                    }\n                }\n                templatedFields {\n                    name\n                    value\n                }\n                template {\n                    ...DefaultIssueTemplateInfo\n                }\n                manageIssues: hasPermission(permission: MANAGE_ISSUES)\n                comment: hasPermission(permission: COMMENT)\n                moderator: hasPermission(permission: MODERATOR)\n                exportIssues: hasPermission(permission: EXPORT_ISSUES)\n            }\n        }\n    }\n": typeof types.GetIssueDocument;
    "\n    mutation changeIssueType($issue: ID!, $type: ID!) {\n        changeIssueType(input: { issue: $issue, type: $type }) {\n            typeChangedEvent {\n                ...TypeChangedEventTimelineInfo\n            }\n        }\n    }\n": typeof types.ChangeIssueTypeDocument;
    "\n    mutation changeIssueState($issue: ID!, $state: ID!) {\n        changeIssueState(input: { issue: $issue, state: $state }) {\n            stateChangedEvent {\n                ...StateChangedEventTimelineInfo\n            }\n        }\n    }\n": typeof types.ChangeIssueStateDocument;
    "\n    mutation changeIssuePriority($issue: ID!, $priority: ID!) {\n        changeIssuePriority(input: { issue: $issue, priority: $priority }) {\n            priorityChangedEvent {\n                ...PriorityChangedEventTimelineInfo\n            }\n        }\n    }\n": typeof types.ChangeIssuePriorityDocument;
    "\n    mutation addLabelToIssue($issue: ID!, $label: ID!) {\n        addLabelToIssue(input: { issue: $issue, label: $label }) {\n            addedLabelEvent {\n                ...AddedLabelEventTimelineInfo\n            }\n        }\n    }\n": typeof types.AddLabelToIssueDocument;
    "\n    mutation removeLabelFromIssue($issue: ID!, $label: ID!) {\n        removeLabelFromIssue(input: { issue: $issue, label: $label }) {\n            removedLabelEvent {\n                ...RemovedLabelEventTimelineInfo\n            }\n        }\n    }\n": typeof types.RemoveLabelFromIssueDocument;
    "\n    mutation removeAssignment($id: ID!) {\n        removeAssignment(input: { assignment: $id }) {\n            removedAssignmentEvent {\n                ...RemovedAssignmentEventTimelineInfo\n            }\n        }\n    }\n": typeof types.RemoveAssignmentDocument;
    "\n    mutation changeAssignmentType($assignment: ID!, $type: ID) {\n        changeAssignmentType(input: { assignment: $assignment, type: $type }) {\n            assignmentTypeChangedEvent {\n                ...AssignmentTypeChangedEventTimelineInfo\n            }\n        }\n    }\n": typeof types.ChangeAssignmentTypeDocument;
    "\n    mutation createAssignment($issue: ID!, $user: ID!) {\n        createAssignment(input: { issue: $issue, user: $user }) {\n            assignment {\n                ...AssignmentTimelineInfo\n            }\n        }\n    }\n": typeof types.CreateAssignmentDocument;
    "\n    mutation removeIssueRelation($id: ID!) {\n        removeIssueRelation(input: { issueRelation: $id }) {\n            removedOutgoingRelationEvent {\n                ...RemovedOutgoingRelationEventTimelineInfo\n            }\n        }\n    }\n": typeof types.RemoveIssueRelationDocument;
    "\n    mutation changeIssueRelationType($issueRelation: ID!, $type: ID) {\n        changeIssueRelationType(input: { issueRelation: $issueRelation, type: $type }) {\n            outgoingRelationTypeChangedEvent {\n                ...OutgoingRelationTypeChangedEventTimelineInfo\n            }\n        }\n    }\n": typeof types.ChangeIssueRelationTypeDocument;
    "\n    mutation createIssueRelation($issue: ID!, $relatedIssue: ID!) {\n        createIssueRelation(input: { issue: $issue, relatedIssue: $relatedIssue }) {\n            issueRelation {\n                ...IssueRelationTimelineInfo\n            }\n        }\n    }\n": typeof types.CreateIssueRelationDocument;
    "\n    mutation changeIssueTitle($id: ID!, $title: String!) {\n        changeIssueTitle(input: { issue: $id, title: $title }) {\n            titleChangedEvent {\n                ...TitleChangedEventTimelineInfo\n            }\n        }\n    }\n": typeof types.ChangeIssueTitleDocument;
    "\n    mutation addAffectedEntityToIssue($issue: ID!, $affectedEntity: ID!) {\n        addAffectedEntityToIssue(input: { issue: $issue, affectedEntity: $affectedEntity }) {\n            addedAffectedEntityEvent {\n                ...AddedAffectedEntityEventTimelineInfo\n            }\n        }\n    }\n": typeof types.AddAffectedEntityToIssueDocument;
    "\n    mutation removeAffectedEntityFromIssue($issue: ID!, $affectedEntity: ID!) {\n        removeAffectedEntityFromIssue(input: { issue: $issue, affectedEntity: $affectedEntity }) {\n            removedAffectedEntityEvent {\n                ...RemovedAffectedEntityEventTimelineInfo\n            }\n        }\n    }\n": typeof types.RemoveAffectedEntityFromIssueDocument;
    "\n    mutation changeIssueTemplatedField($input: ChangeIssueTemplatedFieldInput!) {\n        changeIssueTemplatedField(input: $input) {\n            templatedFieldChangedEvent {\n                ...TemplatedFieldChangedEventTimelineInfo\n            }\n        }\n    }\n": typeof types.ChangeIssueTemplatedFieldDocument;
    "\n    mutation addIssueToTrackable($issue: ID!, $trackable: ID!) {\n        addIssueToTrackable(input: { issue: $issue, trackable: $trackable }) {\n            addedToTrackableEvent {\n                ...AddedToTrackableEventTimelineInfo\n            }\n        }\n    }\n": typeof types.AddIssueToTrackableDocument;
    "\n    mutation removeIssueFromTrackable($issue: ID!, $trackable: ID!) {\n        removeIssueFromTrackable(input: { issue: $issue, trackable: $trackable }) {\n            removedFromTrackableEvent {\n                ...RemovedFromTrackableEventTimelineInfo\n            }\n        }\n    }\n": typeof types.RemoveIssueFromTrackableDocument;
    "\n    query getIssueList(\n        $orderBy: [IssueOrder!]!\n        $count: Int!\n        $skip: Int!\n        $filter: IssueFilterInput\n        $trackable: ID!\n    ) {\n        node(id: $trackable) {\n            __typename\n            ... on Trackable {\n                issues(filter: $filter, orderBy: $orderBy, first: $count, skip: $skip) {\n                    nodes {\n                        ...IssueListItemInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n": typeof types.GetIssueListDocument;
    "\n    query getFilteredIssueList($query: String!, $count: Int!, $filter: IssueFilterInput) {\n        searchIssues(query: $query, first: $count, filter: $filter) {\n            ...IssueListItemInfo\n        }\n    }\n": typeof types.GetFilteredIssueListDocument;
    "\n    query getComponentIssueList(\n        $orderBy: [IssueOrder!]!\n        $count: Int!\n        $skip: Int!\n        $filter: IssueFilterInput\n        $project: ID!\n    ) {\n        node(id: $project) {\n            __typename\n            ... on Project {\n                componentIssues(filter: $filter, orderBy: $orderBy, first: $count, skip: $skip) {\n                    nodes {\n                        ...ProjectComponentIssueListItemInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n": typeof types.GetComponentIssueListDocument;
    "\n    query getComponentFilteredIssueList($query: String!, $count: Int!, $project: ID!, $filter: IssueFilterInput!) {\n        searchIssues(\n            query: $query\n            first: $count\n            filter: {\n                and: [$filter]\n                trackables: { any: { isComponentAnd: { versions: { any: { partOfProject: $project } } } } }\n            }\n        ) {\n            ...ProjectComponentIssueListItemInfo\n        }\n    }\n": typeof types.GetComponentFilteredIssueListDocument;
    "\n    query getView($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on View {\n                name\n                filterByTemplate {\n                    nodes {\n                        id\n                    }\n                }\n                relationLayouts {\n                    nodes {\n                        relation {\n                            id\n                        }\n                        points {\n                            x\n                            y\n                        }\n                    }\n                }\n                relationPartnerLayouts {\n                    nodes {\n                        relationPartner {\n                            id\n                        }\n                        pos {\n                            x\n                            y\n                        }\n                    }\n                }\n            }\n        }\n    }\n": typeof types.GetViewDocument;
    "\n    mutation addComponentVersionToProject($project: ID!, $componentVersion: ID!) {\n        addComponentVersionToProject(input: { componentVersion: $componentVersion, project: $project }) {\n            componentVersion {\n                component {\n                    template {\n                        id\n                    }\n                }\n            }\n        }\n    }\n": typeof types.AddComponentVersionToProjectDocument;
    "\n    mutation removeComponentVersionFromProject($project: ID!, $componentVersion: ID!) {\n        removeComponentVersionFromProject(input: { componentVersion: $componentVersion, project: $project }) {\n            project {\n                id\n            }\n        }\n    }\n": typeof types.RemoveComponentVersionFromProjectDocument;
    "\n    mutation createRelation($start: ID!, $end: ID!, $template: ID!) {\n        createRelation(input: { start: $start, end: $end, template: $template, templatedFields: [] }) {\n            relation {\n                id\n            }\n        }\n    }\n": typeof types.CreateRelationDocument;
    "\n    mutation deleteRelation($id: ID!) {\n        deleteRelation(input: { id: $id }) {\n            id\n        }\n    }\n": typeof types.DeleteRelationDocument;
    "\n    mutation updateView($input: UpdateViewInput!) {\n        updateView(input: $input) {\n            __typename\n        }\n    }\n": typeof types.UpdateViewDocument;
    "\n    mutation updateProject($input: UpdateProjectInput!) {\n        updateProject(input: $input) {\n            project {\n                id\n            }\n        }\n    }\n": typeof types.UpdateProjectDocument;
    "\n    query getProjectGraph($project: ID!) {\n        node(id: $project) {\n            __typename\n            ... on Project {\n                ...GraphInfo\n                relationLayouts {\n                    nodes {\n                        relation {\n                            id\n                        }\n                        points {\n                            x\n                            y\n                        }\n                    }\n                }\n                relationPartnerLayouts {\n                    nodes {\n                        relationPartner {\n                            id\n                        }\n                        pos {\n                            x\n                            y\n                        }\n                    }\n                }\n            }\n        }\n    }\n": typeof types.GetProjectGraphDocument;
    "\n    query getProject($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on Project {\n                __typename\n                name\n                description\n                ...OpenIssueCount\n                createIssues: hasPermission(permission: CREATE_ISSUES)\n                manageLabels: hasPermission(permission: MANAGE_LABELS)\n                manageComponents: hasPermission(permission: MANAGE_COMPONENTS)\n                manageIssues: hasPermission(permission: MANAGE_ISSUES)\n                manageIMS: hasPermission(permission: MANAGE_IMS)\n                manageViews: hasPermission(permission: MANAGE_VIEWS)\n                admin: hasPermission(permission: ADMIN)\n            }\n        }\n    }\n": typeof types.GetProjectDocument;
    "\n    mutation deleteProject($id: ID!) {\n        deleteProject(input: { id: $id }) {\n            __typename\n        }\n    }\n": typeof types.DeleteProjectDocument;
    "\n    query getProjectGeneralDetails($id: ID!) {\n        node(id: $id) {\n            id\n            ... on Project {\n                name\n                description\n                repositoryURL\n                defaultView {\n                    id\n                }\n                admin: hasPermission(permission: ADMIN)\n            }\n        }\n    }\n": typeof types.GetProjectGeneralDetailsDocument;
    "\n    query getProjectPermissionList(\n        $orderBy: [ProjectPermissionOrder!]!\n        $count: Int!\n        $skip: Int!\n        $project: ID!\n        $filter: ProjectPermissionFilterInput!\n    ) {\n        node(id: $project) {\n            ... on Project {\n                permissions(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n                    nodes {\n                        ...DefaultProjectPermissionInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n": typeof types.GetProjectPermissionListDocument;
    "\n    query getFilteredProjectPermissionList($query: String!, $count: Int!, $filter: ProjectPermissionFilterInput!) {\n        searchProjectPermissions(query: $query, first: $count, filter: $filter) {\n            ...DefaultProjectPermissionInfo\n        }\n    }\n": typeof types.GetFilteredProjectPermissionListDocument;
    "\n    mutation removeProjectPermissionFromProject($project: ID!, $projectPermission: ID!) {\n        updateProject(input: { id: $project, removedPermissions: [$projectPermission] }) {\n            __typename\n        }\n    }\n": typeof types.RemoveProjectPermissionFromProjectDocument;
    "\n    mutation updateProjectPermission($input: UpdateProjectPermissionInput!) {\n        updateProjectPermission(input: $input) {\n            __typename\n        }\n    }\n": typeof types.UpdateProjectPermissionDocument;
    "\n    mutation createProjectPermission($input: CreateProjectPermissionInput!) {\n        createProjectPermission(input: $input) {\n            projectPermission {\n                id\n            }\n        }\n    }\n": typeof types.CreateProjectPermissionDocument;
    "\n    query getViewList($orderBy: [ViewOrder!]!, $count: Int!, $skip: Int!, $project: ID!, $filter: ViewFilterInput!) {\n        node(id: $project) {\n            ... on Project {\n                views(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n                    nodes {\n                        ...DefaultViewInfo\n                        filterByTemplate {\n                            nodes {\n                                description\n                            }\n                        }\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n": typeof types.GetViewListDocument;
    "\n    query getFilteredViewList($query: String!, $count: Int!, $filter: ViewFilterInput!) {\n        searchViews(query: $query, first: $count, filter: $filter) {\n            ...DefaultViewInfo\n            filterByTemplate {\n                nodes {\n                    description\n                }\n            }\n        }\n    }\n": typeof types.GetFilteredViewListDocument;
    "\n    query searchComponentTemplatesForViews($query: String!, $count: Int!) {\n        searchComponentTemplates(query: $query, first: $count) {\n            id\n            name\n            description\n        }\n    }\n": typeof types.SearchComponentTemplatesForViewsDocument;
    "\n    query getProjectComponentTemplates($project: ID!) {\n        node(id: $project) {\n            ... on Project {\n                components {\n                    nodes {\n                        component {\n                            template {\n                                name\n                                id\n                            }\n                        }\n                    }\n                }\n            }\n        }\n    }\n": typeof types.GetProjectComponentTemplatesDocument;
    "\n    mutation deleteView($id: ID!) {\n        deleteView(input: { id: $id }) {\n            __typename\n        }\n    }\n": typeof types.DeleteViewDocument;
    "\n    query getIMSProjectListFromTrackable(\n        $orderBy: [IMSProjectOrder!]!\n        $count: Int!\n        $skip: Int!\n        $trackable: ID!\n        $filter: IMSProjectFilterInput!\n    ) {\n        node(id: $trackable) {\n            __typename\n            ... on Trackable {\n                syncsTo(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n                    nodes {\n                        ...DefaultIMSProjectInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n": typeof types.GetImsProjectListFromTrackableDocument;
    "\n    query getLabelList($orderBy: [LabelOrder!]!, $count: Int!, $skip: Int!, $trackable: ID!) {\n        node(id: $trackable) {\n            __typename\n            ... on Trackable {\n                labels(orderBy: $orderBy, first: $count, skip: $skip) {\n                    nodes {\n                        ...DefaultLabelInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n": typeof types.GetLabelListDocument;
    "\n    query getFilteredLabelList($query: String!, $count: Int!, $trackable: ID!) {\n        searchLabels(query: $query, first: $count, filter: { trackables: { any: { id: { eq: $trackable } } } }) {\n            ...DefaultLabelInfo\n        }\n    }\n": typeof types.GetFilteredLabelListDocument;
    "\n    mutation removeLabelFromTrackable($trackable: ID!, $label: ID!) {\n        removeLabelFromTrackable(input: { label: $label, trackable: $trackable }) {\n            __typename\n        }\n    }\n": typeof types.RemoveLabelFromTrackableDocument;
};
const documents: Documents = {
    "\n    query searchGropiusUsersForPermissionList($query: String!, $count: Int!) {\n        searchGropiusUsers(query: $query, first: $count) {\n            id\n            username\n        }\n    }\n":
        types.SearchGropiusUsersForPermissionListDocument,
    "\n    query getIssueListForProjectSidebar(\n        $orderBy: [IssueOrder!]!\n        $count: Int!\n        $skip: Int!\n        $filter: IssueFilterInput\n        $trackable: ID!\n    ) {\n        node(id: $trackable) {\n            __typename\n            ... on Trackable {\n                issues(filter: $filter, orderBy: $orderBy, first: $count, skip: $skip) {\n                    nodes {\n                        ...IssueListItemInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n":
        types.GetIssueListForProjectSidebarDocument,
    "\n    query getIssueListOnAggregatedIssue(\n        $orderBy: [IssueOrder!]!\n        $count: Int!\n        $skip: Int!\n        $filter: IssueFilterInput\n        $aggregatedIssue: ID!\n    ) {\n        node(id: $aggregatedIssue) {\n            ... on AggregatedIssue {\n                issues(filter: $filter, orderBy: $orderBy, first: $count, skip: $skip) {\n                    nodes {\n                        ...IssueListItemInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n":
        types.GetIssueListOnAggregatedIssueDocument,
    "\n    query getFilteredIssueListForProjectSidebar($query: String!, $count: Int!, $filter: IssueFilterInput) {\n        searchIssues(query: $query, first: $count, filter: $filter) {\n            ...IssueListItemInfo\n        }\n    }\n":
        types.GetFilteredIssueListForProjectSidebarDocument,
    "\n    query getInterfaceSpecificationVisibilityInfo($id: ID!, $componentTemplate: ID!) {\n        node(id: $id) {\n            ... on InterfaceSpecification {\n                template {\n                    canBeVisibleOnComponents(filter: { id: { eq: $componentTemplate } }) {\n                        totalCount\n                    }\n                    canBeInvisibleOnComponents(filter: { id: { eq: $componentTemplate } }) {\n                        totalCount\n                    }\n                }\n            }\n        }\n    }\n":
        types.GetInterfaceSpecificationVisibilityInfoDocument,
    "\n    mutation addInterfaceSpecificationVersionToComponentVersion(\n        $input: AddInterfaceSpecificationVersionToComponentVersionInput!\n    ) {\n        addInterfaceSpecificationVersionToComponentVersion(input: $input) {\n            __typename\n        }\n    }\n":
        types.AddInterfaceSpecificationVersionToComponentVersionDocument,
    "\n    query getComponentTemplateForDialog($id: ID!) {\n        node(id: $id) {\n            id\n            ... on ComponentTemplate {\n                templateFieldSpecifications {\n                    name\n                    value\n                }\n                componentVersionTemplate {\n                    templateFieldSpecifications {\n                        name\n                        value\n                    }\n                }\n            }\n        }\n    }\n":
        types.GetComponentTemplateForDialogDocument,
    "\n    mutation createComponentFromDialog($input: CreateComponentInput!) {\n        createComponent(input: $input) {\n            component {\n                id\n                versions {\n                    nodes {\n                        id\n                    }\n                }\n            }\n        }\n    }\n":
        types.CreateComponentFromDialogDocument,
    "\n    query getComponentVersionTemplateForDialog($component: ID!) {\n        node(id: $component) {\n            id\n            ... on Component {\n                template {\n                    componentVersionTemplate {\n                        id\n                        templateFieldSpecifications {\n                            name\n                            value\n                        }\n                    }\n                }\n            }\n        }\n    }\n":
        types.GetComponentVersionTemplateForDialogDocument,
    "\n    mutation createComponentVersion($input: CreateComponentVersionInput!) {\n        createComponentVersion(input: $input) {\n            componentVersion {\n                id\n            }\n        }\n    }\n":
        types.CreateComponentVersionDocument,
    "\n    query getIMSTemplateForDialog($id: ID!) {\n        node(id: $id) {\n            id\n            ... on IMSTemplate {\n                templateFieldSpecifications {\n                    name\n                    value\n                }\n            }\n        }\n    }\n":
        types.GetImsTemplateForDialogDocument,
    "\n    mutation createIMS($input: CreateIMSInput!) {\n        createIMS(input: $input) {\n            ims {\n                id\n            }\n        }\n    }\n":
        types.CreateImsDocument,
    "\n    query getIMSProjectTemplateForDialog($id: ID!) {\n        node(id: $id) {\n            id\n            ... on IMS {\n                template {\n                    imsProjectTemplate {\n                        id\n                        templateFieldSpecifications {\n                            name\n                            value\n                        }\n                    }\n                }\n            }\n        }\n    }\n":
        types.GetImsProjectTemplateForDialogDocument,
    "\n    mutation createIMSProject($input: CreateIMSProjectInput!) {\n        createIMSProject(input: $input) {\n            imsProject {\n                id\n            }\n        }\n    }\n":
        types.CreateImsProjectDocument,
    "\n    query getInterfaceSpecificationTemplateForDialog($id: ID!) {\n        node(id: $id) {\n            id\n            ... on InterfaceSpecificationTemplate {\n                templateFieldSpecifications {\n                    name\n                    value\n                }\n                interfaceSpecificationVersionTemplate {\n                    templateFieldSpecifications {\n                        name\n                        value\n                    }\n                }\n            }\n        }\n    }\n":
        types.GetInterfaceSpecificationTemplateForDialogDocument,
    "\n    mutation createInterfaceSpecificationFromDialog($input: CreateInterfaceSpecificationInput!) {\n        createInterfaceSpecification(input: $input) {\n            interfaceSpecification {\n                id\n                versions {\n                    nodes {\n                        id\n                    }\n                }\n            }\n        }\n    }\n":
        types.CreateInterfaceSpecificationFromDialogDocument,
    "\n    query getInterfaceSpecificationVersionTemplateForDialog($interfaceSpecification: ID!) {\n        node(id: $interfaceSpecification) {\n            id\n            ... on InterfaceSpecification {\n                template {\n                    interfaceSpecificationVersionTemplate {\n                        id\n                        templateFieldSpecifications {\n                            name\n                            value\n                        }\n                    }\n                }\n            }\n        }\n    }\n":
        types.GetInterfaceSpecificationVersionTemplateForDialogDocument,
    "\n    mutation createInterfaceSpecificationVersion($input: CreateInterfaceSpecificationVersionInput!) {\n        createInterfaceSpecificationVersion(input: $input) {\n            interfaceSpecificationVersion {\n                id\n            }\n        }\n    }\n":
        types.CreateInterfaceSpecificationVersionDocument,
    "\n    query getIssueTemplateForDialog($id: ID!) {\n        node(id: $id) {\n            id\n            ... on IssueTemplate {\n                templateFieldSpecifications {\n                    name\n                    value\n                }\n            }\n        }\n    }\n":
        types.GetIssueTemplateForDialogDocument,
    "\n    mutation createIssueFromDialog($input: CreateIssueInput!) {\n        createIssue(input: $input) {\n            issue {\n                id\n            }\n        }\n    }\n":
        types.CreateIssueFromDialogDocument,
    "\n    query searchIssueTemplatesByName($query: String!, $count: Int!) {\n        searchIssueTemplates(query: $query, first: $count, filter: { isDeprecated: { eq: false } }) {\n            id\n            name\n        }\n    }\n":
        types.SearchIssueTemplatesByNameDocument,
    "\n    query getIssueTemplateFields($id: ID!) {\n        node(id: $id) {\n            __typename\n            ... on IssueTemplate {\n                ...IssueTemplateFields\n            }\n        }\n    }\n":
        types.GetIssueTemplateFieldsDocument,
    "\n    query getIssueTemplateName($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on IssueTemplate {\n                name\n            }\n        }\n    }\n":
        types.GetIssueTemplateNameDocument,
    "\n    mutation createIssueTemplate($input: CreateIssueTemplateInput!) {\n        createIssueTemplate(input: $input) {\n            issueTemplate {\n                ...DefaultIssueTemplateInfo\n            }\n        }\n    }\n":
        types.CreateIssueTemplateDocument,
    "\n    mutation createLabel($input: CreateLabelInput!) {\n        createLabel(input: $input) {\n            label {\n                ...DefaultLabelInfo\n            }\n        }\n    }\n":
        types.CreateLabelDocument,
    "\n    mutation createLegalInformation($input: CreateLegalInformationInput!) {\n        createLegalInformation(input: $input) {\n            legalInformation {\n                ...DefaultLegalInformationInfo\n            }\n        }\n    }\n":
        types.CreateLegalInformationDocument,
    "\n    mutation createProject($input: CreateProjectInput!) {\n        createProject(input: $input) {\n            project {\n                id\n            }\n        }\n    }\n":
        types.CreateProjectDocument,
    "\n    mutation createView($input: CreateViewInput!) {\n        createView(input: $input) {\n            view {\n                id\n            }\n        }\n    }\n":
        types.CreateViewDocument,
    "\n    mutation addComponentPermissionToComponent($component: ID!, $componentPermission: ID!) {\n        updateComponent(input: { id: $component, addedPermissions: [$componentPermission] }) {\n            __typename\n        }\n    }\n":
        types.AddComponentPermissionToComponentDocument,
    "\n    mutation addIMSPermissionToIMS($ims: ID!, $imsPermission: ID!) {\n        updateIMS(input: { id: $ims, addedPermissions: [$imsPermission] }) {\n            __typename\n        }\n    }\n":
        types.AddImsPermissionToImsDocument,
    "\n    mutation addIssueToTrackableForImport($issue: ID!, $trackable: ID!) {\n        addIssueToTrackable(input: { issue: $issue, trackable: $trackable }) {\n            __typename\n        }\n    }\n":
        types.AddIssueToTrackableForImportDocument,
    "\n    mutation addLabelToTrackable($trackable: ID!, $label: ID!) {\n        addLabelToTrackable(input: { label: $label, trackable: $trackable }) {\n            __typename\n        }\n    }\n":
        types.AddLabelToTrackableDocument,
    "\n    mutation addProjectPermissionToProject($project: ID!, $projectPermission: ID!) {\n        updateProject(input: { id: $project, addedPermissions: [$projectPermission] }) {\n            __typename\n        }\n    }\n":
        types.AddProjectPermissionToProjectDocument,
    "\n    query getPermissionUserList($orderBy: [GropiusUserOrder!]!, $count: Int!, $skip: Int!, $permission: ID!) {\n        node(id: $permission) {\n            ... on BasePermission {\n                users(orderBy: $orderBy, first: $count, skip: $skip) {\n                    nodes {\n                        ...DefaultUserInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n":
        types.GetPermissionUserListDocument,
    "\n    query getFilteredPermissionUserList($query: String!, $count: Int!, $permission: ID!) {\n        searchGropiusUsers(\n            query: $query\n            first: $count\n            filter: { permissions: { any: { id: { eq: $permission } } } }\n        ) {\n            ...DefaultUserInfo\n        }\n    }\n":
        types.GetFilteredPermissionUserListDocument,
    "\n    mutation updateLabel($input: UpdateLabelInput!) {\n        updateLabel(input: $input) {\n            label {\n                id\n            }\n        }\n    }\n":
        types.UpdateLabelDocument,
    "\n    mutation updateLegalInformationForDialog($input: UpdateLegalInformationInput!) {\n        updateLegalInformation(input: $input) {\n            legalInformation {\n                id\n            }\n        }\n    }\n":
        types.UpdateLegalInformationForDialogDocument,
    "\n    mutation updateIssueType($input: UpdateIssueTypeInput!) {\n        updateIssueType(input: $input) {\n            issueType {\n                id\n            }\n        }\n    }\n":
        types.UpdateIssueTypeDocument,
    "\n    mutation updateIssuePriority($input: UpdateIssuePriorityInput!) {\n        updateIssuePriority(input: $input) {\n            issuePriority {\n                id\n            }\n        }\n    }\n":
        types.UpdateIssuePriorityDocument,
    "\n    mutation updateIssueState($input: UpdateIssueStateInput!) {\n        updateIssueState(input: $input) {\n            issueState {\n                id\n            }\n        }\n    }\n":
        types.UpdateIssueStateDocument,
    "\n    mutation updateAssignmentType($input: UpdateAssignmentTypeInput!) {\n        updateAssignmentType(input: $input) {\n            assignmentType {\n                id\n            }\n        }\n    }\n":
        types.UpdateAssignmentTypeDocument,
    "\n    mutation updateIssueRelationType($input: UpdateIssueRelationTypeInput!) {\n        updateIssueRelationType(input: $input) {\n            issueRelationType {\n                id\n            }\n        }\n    }\n":
        types.UpdateIssueRelationTypeDocument,
    "\n    mutation updateViewForDialog($input: UpdateViewInput!) {\n        updateView(input: $input) {\n            view {\n                id\n            }\n        }\n    }\n":
        types.UpdateViewForDialogDocument,
    "\n    query searchAffectedByIssuesForAutocomplete($query: String!, $count: Int!, $trackable: ID!, $sublistCount: Int) {\n        searchAffectedByIssues(query: $query, first: $count, filter: { relatedTo: $trackable }) {\n            ...DetailedAffectedByIssueInfo\n        }\n    }\n":
        types.SearchAffectedByIssuesForAutocompleteDocument,
    "\n    query firstComponentVersionsForAutocomplete($component: ID!, $count: Int!) {\n        node(id: $component) {\n            ... on Component {\n                versions(first: $count) {\n                    nodes {\n                        ...DefaultComponentVersionInfo\n                    }\n                }\n            }\n        }\n    }\n":
        types.FirstComponentVersionsForAutocompleteDocument,
    "\n    query searchTrackablesForAutocomplete($query: String!, $count: Int!) {\n        searchTrackables(query: $query, first: $count) {\n            ...DefaultTrackableInfo\n        }\n    }\n":
        types.SearchTrackablesForAutocompleteDocument,
    "\n    query firstTrackablesForAutocomplete($count: Int!) {\n        trackables(first: $count) {\n            nodes {\n                ...DefaultTrackableInfo\n            }\n        }\n    }\n":
        types.FirstTrackablesForAutocompleteDocument,
    "\n    query searchAssignmentTypes($template: ID!, $query: String!, $count: Int!) {\n        searchAssignmentTypes(query: $query, first: $count, filter: { partOf: { any: { id: { eq: $template } } } }) {\n            ...DefaultAssignmentTypeInfo\n        }\n    }\n":
        types.SearchAssignmentTypesDocument,
    "\n    query firstAssignmentTypes($template: ID!, $count: Int!) {\n        node(id: $template) {\n            ... on IssueTemplate {\n                assignmentTypes(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultAssignmentTypeInfo\n                    }\n                }\n            }\n        }\n    }\n":
        types.FirstAssignmentTypesDocument,
    "\n    query searchComponentTemplatesForAutocomplete($query: String!, $count: Int!) {\n        searchComponentTemplates(query: $query, first: $count, filter: { isDeprecated: { eq: false } }) {\n            ...DefaultComponentTemplateInfo\n        }\n    }\n":
        types.SearchComponentTemplatesForAutocompleteDocument,
    "\n    query firstComponentTemplatesForAutocomplete($count: Int!) {\n        componentTemplates(first: $count, orderBy: [{ field: NAME }], filter: { isDeprecated: { eq: false } }) {\n            nodes {\n                ...DefaultComponentTemplateInfo\n            }\n        }\n    }\n":
        types.FirstComponentTemplatesForAutocompleteDocument,
    "\n    query searchComponentVersions($query: String!, $count: Int!, $component: ID!) {\n        searchComponentVersions(query: $query, first: $count, filter: { component: { id: { eq: $component } } }) {\n            ...DefaultComponentVersionInfo\n        }\n    }\n":
        types.SearchComponentVersionsDocument,
    "\n    query firstComponentVersions($component: ID!, $count: Int!) {\n        node(id: $component) {\n            id\n            ... on Component {\n                versions(first: $count) {\n                    nodes {\n                        ...DefaultComponentVersionInfo\n                    }\n                }\n            }\n        }\n    }\n":
        types.FirstComponentVersionsDocument,
    "\n    query searchComponentsForVersionAutocomplete($query: String!, $count: Int!, $filter: ComponentFilterInput) {\n        searchComponents(query: $query, first: $count, filter: $filter) {\n            ...DefaultTrackableInfo\n        }\n    }\n":
        types.SearchComponentsForVersionAutocompleteDocument,
    "\n    query firstComponentsForVersionAutocomplete($count: Int!, $filter: ComponentFilterInput) {\n        components(first: $count, filter: $filter) {\n            nodes {\n                ...DefaultTrackableInfo\n            }\n        }\n    }\n":
        types.FirstComponentsForVersionAutocompleteDocument,
    "\n    query searchComponentPermissionsForExternal($query: String!, $count: Int!, $component: ID!) {\n        searchComponentPermissions(\n            query: $query\n            first: $count\n            filter: { nodesWithPermission: { any: { id: { eq: $component } } } }\n        ) {\n            ...DefaultComponentPermissionInfo\n        }\n    }\n":
        types.SearchComponentPermissionsForExternalDocument,
    "\n    query firstComponentPermissions($component: ID!, $count: Int!) {\n        node(id: $component) {\n            ... on Component {\n                permissions(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultComponentPermissionInfo\n                    }\n                }\n            }\n        }\n    }\n":
        types.FirstComponentPermissionsDocument,
    "\n    query searchComponentsForPermissionAutocomplete($query: String!, $count: Int!) {\n        searchComponents(query: $query, first: $count) {\n            ...DefaultTrackableInfo\n        }\n    }\n":
        types.SearchComponentsForPermissionAutocompleteDocument,
    "\n    query firstComponentsForPermissionAutocomplete($count: Int!) {\n        components(first: $count) {\n            nodes {\n                ...DefaultTrackableInfo\n            }\n        }\n    }\n":
        types.FirstComponentsForPermissionAutocompleteDocument,
    "\n    query searchIMSPermissionsForExternal($query: String!, $count: Int!, $ims: ID!) {\n        searchIMSPermissions(\n            query: $query\n            first: $count\n            filter: { nodesWithPermission: { any: { id: { eq: $ims } } } }\n        ) {\n            ...DefaultIMSPermissionInfo\n        }\n    }\n":
        types.SearchImsPermissionsForExternalDocument,
    "\n    query firstIMSPermissions($ims: ID!, $count: Int!) {\n        node(id: $ims) {\n            ... on IMS {\n                permissions(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultIMSPermissionInfo\n                    }\n                }\n            }\n        }\n    }\n":
        types.FirstImsPermissionsDocument,
    "\n    query searchIMSsForExternal($query: String!, $count: Int!) {\n        searchIMSs(query: $query, first: $count) {\n            ...DefaultIMSInfo\n        }\n    }\n":
        types.SearchImSsForExternalDocument,
    "\n    query searchIssuesForExternal($query: String!, $count: Int!, $trackable: ID!) {\n        searchIssues(query: $query, first: $count, filter: { trackables: { any: { id: { eq: $trackable } } } }) {\n            ...DefaultIssueInfo\n        }\n    }\n":
        types.SearchIssuesForExternalDocument,
    "\n    query firstIssuesForExternalAutocomplete($trackable: ID!, $count: Int!) {\n        node(id: $trackable) {\n            ... on Component {\n                issues(first: $count, orderBy: [{ field: LAST_UPDATED_AT, direction: DESC }]) {\n                    nodes {\n                        ...DefaultIssueInfo\n                    }\n                }\n            }\n        }\n    }\n":
        types.FirstIssuesForExternalAutocompleteDocument,
    "\n    query searchTrackablesForExternal($query: String!, $count: Int!) {\n        searchTrackables(query: $query, first: $count) {\n            ...DefaultTrackableInfo\n        }\n    }\n":
        types.SearchTrackablesForExternalDocument,
    "\n    query firstTrackablesForExternal($count: Int!) {\n        trackables(first: $count) {\n            nodes {\n                ...DefaultTrackableInfo\n            }\n        }\n    }\n":
        types.FirstTrackablesForExternalDocument,
    "\n    query searchTrackableLabels($trackable: ID!, $query: String!, $count: Int!) {\n        searchLabels(query: $query, first: $count, filter: { trackables: { any: { id: { eq: $trackable } } } }) {\n            ...DefaultLabelInfo\n        }\n    }\n":
        types.SearchTrackableLabelsDocument,
    "\n    query firstTrackableLabelsForExternal($trackable: ID!, $count: Int!) {\n        node(id: $trackable) {\n            ... on Trackable {\n                labels(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultLabelInfo\n                    }\n                }\n            }\n        }\n    }\n":
        types.FirstTrackableLabelsForExternalDocument,
    "\n    query searchProjectPermissions($project: ID!, $query: String!, $count: Int!) {\n        searchProjectPermissions(\n            query: $query\n            first: $count\n            filter: { nodesWithPermission: { any: { id: { eq: $project } } } }\n        ) {\n            ...DefaultProjectPermissionInfo\n        }\n    }\n":
        types.SearchProjectPermissionsDocument,
    "\n    query firstProjectPermissions($project: ID!, $count: Int!) {\n        node(id: $project) {\n            ... on Project {\n                permissions(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultProjectPermissionInfo\n                    }\n                }\n            }\n        }\n    }\n":
        types.FirstProjectPermissionsDocument,
    "\n    query searchProjectsForPermissionAutocomplete($query: String!, $count: Int!) {\n        searchProjects(query: $query, first: $count) {\n            ...DefaultTrackableInfo\n        }\n    }\n":
        types.SearchProjectsForPermissionAutocompleteDocument,
    "\n    query firstProjectsForPermissionAutocomplete($count: Int!) {\n        projects(first: $count) {\n            nodes {\n                ...DefaultTrackableInfo\n            }\n        }\n    }\n":
        types.FirstProjectsForPermissionAutocompleteDocument,
    "\n    query searchGropiusUsers($query: String!, $count: Int!, $filter: GropiusUserFilterInput) {\n        searchGropiusUsers(query: $query, first: $count, filter: $filter) {\n            ...DefaultUserInfo\n        }\n    }\n":
        types.SearchGropiusUsersDocument,
    "\n    query searchIMSs($query: String!, $count: Int!, $filter: IMSFilterInput) {\n        searchIMSs(query: $query, first: $count, filter: $filter) {\n            ...DefaultIMSInfo\n        }\n    }\n":
        types.SearchImSsDocument,
    "\n    query firstIMSs($count: Int!, $filter: IMSFilterInput) {\n        imss(first: $count, filter: $filter) {\n            nodes {\n                ...DefaultIMSInfo\n            }\n        }\n    }\n":
        types.FirstImSsDocument,
    "\n    query searchIMSTemplatesForAutocomplete($query: String!, $count: Int!) {\n        searchIMSTemplates(query: $query, first: $count, filter: { isDeprecated: { eq: false } }) {\n            ...DefaultIMSTemplateInfo\n        }\n    }\n":
        types.SearchImsTemplatesForAutocompleteDocument,
    "\n    query firstIMSTemplatesForAutocomplete($count: Int!) {\n        imsTemplates(first: $count, orderBy: [{ field: NAME }], filter: { isDeprecated: { eq: false } }) {\n            nodes {\n                ...DefaultIMSTemplateInfo\n            }\n        }\n    }\n":
        types.FirstImsTemplatesForAutocompleteDocument,
    "\n    query searchInterfaceSpecifications($query: String!, $count: Int!, $component: ID!) {\n        searchInterfaceSpecifications(query: $query, first: $count, filter: { component: { id: { eq: $component } } }) {\n            ...DefaultInterfaceSpecificationInfo\n        }\n    }\n":
        types.SearchInterfaceSpecificationsDocument,
    "\n    query firstInterfaceSpecifications($count: Int!, $component: ID!) {\n        node(id: $component) {\n            ... on Component {\n                interfaceSpecifications(first: $count) {\n                    nodes {\n                        ...DefaultInterfaceSpecificationInfo\n                    }\n                }\n            }\n        }\n    }\n":
        types.FirstInterfaceSpecificationsDocument,
    "\n    query searchInterfaceSpecificationTemplates(\n        $query: String!\n        $count: Int!\n        $filter: InterfaceSpecificationTemplateFilterInput\n    ) {\n        searchInterfaceSpecificationTemplates(query: $query, first: $count, filter: $filter) {\n            ...DefaultInterfaceSpecificationTemplateInfo\n        }\n    }\n":
        types.SearchInterfaceSpecificationTemplatesDocument,
    "\n    query firstInterfaceSpecificationTemplates($count: Int!, $filter: InterfaceSpecificationTemplateFilterInput) {\n        interfaceSpecificationTemplates(first: $count, orderBy: [{ field: NAME }], filter: $filter) {\n            nodes {\n                ...DefaultInterfaceSpecificationTemplateInfo\n            }\n        }\n    }\n":
        types.FirstInterfaceSpecificationTemplatesDocument,
    "\n    query searchInterfaceSpecificationVersionsForAutocomplete(\n        $query: String!\n        $count: Int!\n        $interfaceSpecification: ID!\n    ) {\n        searchInterfaceSpecificationVersions(\n            query: $query\n            first: $count\n            filter: { interfaceSpecification: { id: { eq: $interfaceSpecification } } }\n        ) {\n            ...DefaultInterfaceSpecificationVersionInfo\n        }\n    }\n":
        types.SearchInterfaceSpecificationVersionsForAutocompleteDocument,
    "\n    query firstInterfaceSpecificationVersionsForAutocomplete($interfaceSpecification: ID!, $count: Int!) {\n        node(id: $interfaceSpecification) {\n            ... on InterfaceSpecification {\n                versions(first: $count) {\n                    nodes {\n                        ...DefaultInterfaceSpecificationVersionInfo\n                    }\n                }\n            }\n        }\n    }\n":
        types.FirstInterfaceSpecificationVersionsForAutocompleteDocument,
    "\n    query searchInterfaceSpecificationsForAutocomplete($query: String!, $count: Int!, $component: ID!) {\n        searchInterfaceSpecifications(query: $query, first: $count, filter: { component: { id: { eq: $component } } }) {\n            ...DefaultInterfaceSpecificationInfo\n        }\n    }\n":
        types.SearchInterfaceSpecificationsForAutocompleteDocument,
    "\n    query firstInterfaceSpecificationsForAutocomplete($count: Int!, $component: ID!) {\n        node(id: $component) {\n            ... on Component {\n                interfaceSpecifications(first: $count) {\n                    nodes {\n                        ...DefaultInterfaceSpecificationInfo\n                    }\n                }\n            }\n        }\n    }\n":
        types.FirstInterfaceSpecificationsForAutocompleteDocument,
    "\n    query searchInterfaceSpecificationVersionsForModel($query: String!, $count: Int!, $interfaceSpecification: ID!) {\n        searchInterfaceSpecificationVersions(\n            query: $query\n            first: $count\n            filter: { interfaceSpecification: { id: { eq: $interfaceSpecification } } }\n        ) {\n            ...DefaultInterfaceSpecificationVersionInfo\n        }\n    }\n":
        types.SearchInterfaceSpecificationVersionsForModelDocument,
    "\n    query firstInterfaceSpecificationVersionsForModel($interfaceSpecification: ID!, $count: Int!) {\n        node(id: $interfaceSpecification) {\n            ... on InterfaceSpecification {\n                versions(first: $count) {\n                    nodes {\n                        ...DefaultInterfaceSpecificationVersionInfo\n                    }\n                }\n            }\n        }\n    }\n":
        types.FirstInterfaceSpecificationVersionsForModelDocument,
    "\n    query getUsedIssueTemplates($trackable: ID!, $filter: String!) {\n        node(id: $trackable) {\n            ... on Trackable {\n                usedIssueTemplates(filter: { name: { contains: $filter } }) {\n                    nodes {\n                        ...DefaultIssueTemplateInfo\n                    }\n                }\n            }\n        }\n    }\n":
        types.GetUsedIssueTemplatesDocument,
    "\n    query getUsedLabels($trackable: ID!, $filter: String!) {\n        node(id: $trackable) {\n            ... on Trackable {\n                usedLabels(filter: { name: { contains: $filter } }) {\n                    nodes {\n                        ...DefaultLabelInfo\n                        trackables {\n                            nodes {\n                                id\n                                name\n                                description\n                            }\n                        }\n                    }\n                }\n            }\n        }\n    }\n":
        types.GetUsedLabelsDocument,
    "\n    query firstTrackableLabelsForFilter($trackable: ID!, $count: Int!) {\n        node(id: $trackable) {\n            ... on Trackable {\n                labels(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultLabelInfo\n                        trackables {\n                            nodes {\n                                id\n                                name\n                                description\n                            }\n                        }\n                    }\n                }\n            }\n        }\n    }\n":
        types.FirstTrackableLabelsForFilterDocument,
    "\n    query getUsedIssuePriorities($trackable: ID!, $filter: String!) {\n        node(id: $trackable) {\n            ... on Trackable {\n                usedIssuePriorities(filter: { name: { contains: $filter } }) {\n                    nodes {\n                        ...DefaultIssuePriorityInfo\n                    }\n                }\n            }\n        }\n    }\n":
        types.GetUsedIssuePrioritiesDocument,
    "\n    query getUsedIssueTypes($trackable: ID!, $filter: String!) {\n        node(id: $trackable) {\n            ... on Trackable {\n                usedIssueTypes(filter: { name: { contains: $filter } }) {\n                    nodes {\n                        ...DefaultIssueTypeInfo\n                    }\n                }\n            }\n        }\n    }\n":
        types.GetUsedIssueTypesDocument,
    "\n    query getAssignedUsers($trackable: ID!, $filter: String!) {\n        node(id: $trackable) {\n            ... on Trackable {\n                assignedUsers(filter: { username: { contains: $filter } }) {\n                    nodes {\n                        ...DefaultUserInfo\n                    }\n                }\n            }\n        }\n    }\n":
        types.GetAssignedUsersDocument,
    "\n    query getUsedIssueStates($trackable: ID!, $filter: String!) {\n        node(id: $trackable) {\n            ... on Trackable {\n                usedIssueStates(filter: { name: { contains: $filter } }) {\n                    nodes {\n                        ...DefaultIssueStateInfo\n                    }\n                }\n            }\n        }\n    }\n":
        types.GetUsedIssueStatesDocument,
    "\n    query firstAffectedByIssuesForFilter($trackable: ID!, $count: Int!, $sublistCount: Int!) {\n        node(id: $trackable) {\n            ... on Trackable {\n                affectedEntities(first: $count) {\n                    nodes {\n                        ...DetailedAffectedByIssueInfo\n                    }\n                }\n            }\n        }\n    }\n":
        types.FirstAffectedByIssuesForFilterDocument,
    "\n    query searchAffectedByIssuesForFilter($query: String!, $count: Int!, $trackable: ID!) {\n        searchAffectedByIssues(query: $query, first: $count, filter: { relatedTo: $trackable }) {\n            ...DefaultAffectedByIssueInfo\n            ... on Component {\n                versions(first: 100) {\n                    nodes {\n                        id\n                        version\n                    }\n                }\n            }\n            ... on InterfaceSpecification {\n                versions(first: 100) {\n                    nodes {\n                        id\n                        version\n                        interfaceDefinitions(\n                            first: 100\n                            filter: {\n                                visibleInterface: {}\n                                componentVersion: { component: { id: { eq: $trackable } } }\n                            }\n                        ) {\n                            nodes {\n                                visibleInterface {\n                                    id\n                                }\n                            }\n                        }\n                    }\n                }\n            }\n            ... on InterfaceSpecificationVersion {\n                interfaceDefinitions(\n                    first: 100\n                    filter: { visibleInterface: {}, componentVersion: { component: { id: { eq: $trackable } } } }\n                ) {\n                    nodes {\n                        visibleInterface {\n                            id\n                        }\n                    }\n                }\n            }\n        }\n    }\n":
        types.SearchAffectedByIssuesForFilterDocument,
    "\n    query searchAffectedByIssuesWithoutTrackableForFilter($query: String!, $count: Int!) {\n        searchAffectedByIssues(query: $query, first: $count) {\n            ...DefaultAffectedByIssueInfo\n            ... on Component {\n                versions(first: 100) {\n                    nodes {\n                        id\n                        version\n                    }\n                }\n            }\n            ... on InterfaceSpecification {\n                versions(first: 100) {\n                    nodes {\n                        id\n                        version\n                        interfaceDefinitions(first: 100, filter: { visibleInterface: {} }) {\n                            nodes {\n                                visibleInterface {\n                                    id\n                                }\n                            }\n                        }\n                    }\n                }\n            }\n            ... on InterfaceSpecificationVersion {\n                interfaceDefinitions(first: 100, filter: { visibleInterface: {} }) {\n                    nodes {\n                        visibleInterface {\n                            id\n                        }\n                    }\n                }\n            }\n        }\n    }\n":
        types.SearchAffectedByIssuesWithoutTrackableForFilterDocument,
    "\n    query searchIssuePriorities($template: ID!, $query: String!, $count: Int!) {\n        searchIssuePriorities(query: $query, first: $count, filter: { partOf: { any: { id: { eq: $template } } } }) {\n            ...DefaultIssuePriorityInfo\n        }\n    }\n":
        types.SearchIssuePrioritiesDocument,
    "\n    query firstIssuePriorities($template: ID!, $count: Int!) {\n        node(id: $template) {\n            ... on IssueTemplate {\n                issuePriorities(first: $count, orderBy: [{ field: VALUE }, { field: NAME }]) {\n                    nodes {\n                        ...DefaultIssuePriorityInfo\n                    }\n                }\n            }\n        }\n    }\n":
        types.FirstIssuePrioritiesDocument,
    "\n    query searchIssueRelationTypes($template: ID!, $query: String!, $count: Int!) {\n        searchIssueRelationTypes(query: $query, first: $count, filter: { partOf: { any: { id: { eq: $template } } } }) {\n            ...DefaultIssueRelationTypeInfo\n        }\n    }\n":
        types.SearchIssueRelationTypesDocument,
    "\n    query firstIssueRelationTypes($template: ID!, $count: Int!) {\n        node(id: $template) {\n            ... on IssueTemplate {\n                relationTypes(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultIssueRelationTypeInfo\n                    }\n                }\n            }\n        }\n    }\n":
        types.FirstIssueRelationTypesDocument,
    "\n    query searchIssueStates($template: ID!, $query: String!, $count: Int!) {\n        searchIssueStates(query: $query, first: $count, filter: { partOf: { any: { id: { eq: $template } } } }) {\n            ...DefaultIssueStateInfo\n        }\n    }\n":
        types.SearchIssueStatesDocument,
    "\n    query firstIssueStates($template: ID!, $count: Int!) {\n        node(id: $template) {\n            ... on IssueTemplate {\n                issueStates(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultIssueStateInfo\n                    }\n                }\n            }\n        }\n    }\n":
        types.FirstIssueStatesDocument,
    "\n    query searchIssueTemplates($query: String!, $count: Int!) {\n        searchIssueTemplates(query: $query, first: $count, filter: { isDeprecated: { eq: false } }) {\n            ...DefaultIssueTemplateInfo\n        }\n    }\n":
        types.SearchIssueTemplatesDocument,
    "\n    query firstIssueTemplates($count: Int!) {\n        issueTemplates(first: $count, orderBy: [{ field: NAME }], filter: { isDeprecated: { eq: false } }) {\n            nodes {\n                ...DefaultIssueTemplateInfo\n            }\n        }\n    }\n":
        types.FirstIssueTemplatesDocument,
    "\n    query searchIssueTypes($template: ID!, $query: String!, $count: Int!) {\n        searchIssueTypes(query: $query, first: $count, filter: { partOf: { any: { id: { eq: $template } } } }) {\n            ...DefaultIssueTypeInfo\n        }\n    }\n":
        types.SearchIssueTypesDocument,
    "\n    query firstIssueTypes($template: ID!, $count: Int!) {\n        node(id: $template) {\n            ... on IssueTemplate {\n                issueTypes(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultIssueTypeInfo\n                    }\n                }\n            }\n        }\n    }\n":
        types.FirstIssueTypesDocument,
    "\n    query searchLabels($issue: ID!, $query: String!, $count: Int!) {\n        searchLabels(\n            query: $query\n            first: $count\n            filter: { trackables: { any: { issues: { any: { id: { eq: $issue } } } } } }\n        ) {\n            ...DefaultLabelInfo\n        }\n    }\n":
        types.SearchLabelsDocument,
    "\n    query firstLabelsForAutocomplete($issue: ID!, $count: Int!) {\n        node(id: $issue) {\n            id\n            ... on Issue {\n                trackables {\n                    nodes {\n                        labels(first: $count, orderBy: [{ field: NAME }]) {\n                            nodes {\n                                ...DefaultLabelInfo\n                            }\n                        }\n                    }\n                }\n            }\n        }\n    }\n":
        types.FirstLabelsForAutocompleteDocument,
    "\n    query searchRelationTemplates($query: String!, $count: Int!, $filter: RelationTemplateFilterInput) {\n        searchRelationTemplates(query: $query, first: $count, filter: $filter) {\n            ...DefaultRelationTemplateInfo\n        }\n    }\n":
        types.SearchRelationTemplatesDocument,
    "\n    query getRelationTemplates($count: Int!, $filter: RelationTemplateFilterInput) {\n        relationTemplates(first: $count, filter: $filter) {\n            nodes {\n                ...DefaultRelationTemplateInfo\n            }\n        }\n    }\n":
        types.GetRelationTemplatesDocument,
    "\n    query getSyncPermissionTargetForSwitch($id: ID!) {\n        node(id: $id) {\n            id\n            ... on IMS {\n                isSyncOthersAllowed\n            }\n        }\n    }\n":
        types.GetSyncPermissionTargetForSwitchDocument,
    "\n    mutation updateSyncPermissionsForSwitch($input: UpdateSyncPermissionsInput!) {\n        updateSyncPermissions(input: $input) {\n            __typename\n        }\n    }\n":
        types.UpdateSyncPermissionsForSwitchDocument,
    "\n    query searchTrackables($query: String!, $count: Int!, $filter: TrackableFilterInput) {\n        searchTrackables(query: $query, first: $count, filter: $filter) {\n            ...DefaultTrackableInfo\n        }\n    }\n":
        types.SearchTrackablesDocument,
    "\n    query firstTrackables($count: Int!, $filter: TrackableFilterInput) {\n        trackables(first: $count, filter: $filter) {\n            nodes {\n                ...DefaultTrackableInfo\n            }\n        }\n    }\n":
        types.FirstTrackablesDocument,
    "\n    query searchViews($project: ID!, $query: String!, $count: Int!) {\n        searchViews(query: $query, first: $count, filter: { project: { id: { eq: $project } } }) {\n            ...DefaultViewInfo\n        }\n    }\n":
        types.SearchViewsDocument,
    "\n    query firstViews($project: ID!, $count: Int!) {\n        node(id: $project) {\n            ... on Project {\n                views(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultViewInfo\n                    }\n                }\n            }\n        }\n    }\n":
        types.FirstViewsDocument,
    "\n    mutation updateBodyForTimeline($id: ID!, $body: String!) {\n        updateBody(input: { id: $id, body: $body }) {\n            body {\n                id\n                body\n                bodyLastEditedAt\n                bodyLastEditedBy {\n                    ...DefaultUserInfo\n                }\n            }\n        }\n    }\n":
        types.UpdateBodyForTimelineDocument,
    "\n    mutation updateIssueCommentForTimeline($id: ID!, $body: String!) {\n        updateIssueComment(input: { id: $id, body: $body }) {\n            issueComment {\n                id\n                body\n                bodyLastEditedAt\n                bodyLastEditedBy {\n                    ...DefaultUserInfo\n                }\n            }\n        }\n    }\n":
        types.UpdateIssueCommentForTimelineDocument,
    "\n    mutation createIssueCommentForTimeline($issue: ID!, $body: String!, $answers: ID) {\n        createIssueComment(input: { issue: $issue, body: $body, answers: $answers }) {\n            issueComment {\n                ...IssueCommentTimelineInfo\n            }\n        }\n    }\n":
        types.CreateIssueCommentForTimelineDocument,
    "\n    mutation deleteIssueCommentForTimeline($id: ID!) {\n        deleteIssueComment(input: { id: $id }) {\n            issueComment {\n                ...IssueCommentTimelineInfo\n            }\n        }\n    }\n":
        types.DeleteIssueCommentForTimelineDocument,
    "fragment DefaultAffectedByIssueInfo on AffectedByIssue {\n  id\n  ... on Named {\n    name\n    description\n  }\n  ... on ComponentVersion {\n    version\n    component {\n      name\n      description\n    }\n  }\n  ... on InterfaceSpecificationVersion {\n    version\n    interfaceSpecification {\n      name\n      description\n    }\n  }\n  ... on Interface {\n    interfaceDefinition {\n      interfaceSpecificationVersion {\n        version\n        interfaceSpecification {\n          name\n          description\n        }\n      }\n    }\n  }\n  __typename\n}\n\nfragment DetailedAffectedByIssueInfo on AffectedByIssue {\n  ...DefaultAffectedByIssueInfo\n  ... on Component {\n    versions(first: $sublistCount) {\n      nodes {\n        id\n        version\n      }\n    }\n  }\n  ... on InterfaceSpecification {\n    versions(first: $sublistCount) {\n      nodes {\n        id\n        version\n        interfaceDefinitions(\n          first: $sublistCount\n          filter: {visibleInterface: {}, componentVersion: {component: {id: {eq: $trackable}}}}\n        ) {\n          nodes {\n            visibleInterface {\n              id\n            }\n          }\n        }\n      }\n    }\n  }\n  ... on InterfaceSpecificationVersion {\n    interfaceDefinitions(\n      first: $sublistCount\n      filter: {visibleInterface: {}, componentVersion: {component: {id: {eq: $trackable}}}}\n    ) {\n      nodes {\n        visibleInterface {\n          id\n        }\n      }\n    }\n  }\n}":
        types.DefaultAffectedByIssueInfoFragmentDoc,
    "fragment DefaultAssignmentInfo on Assignment {\n  id\n  user {\n    ...UserTimelineInfo\n  }\n  type {\n    ...DefaultAssignmentTypeInfo\n  }\n}\n\nfragment DefaultAssignmentTypeInfo on AssignmentType {\n  id\n  name\n  description\n}":
        types.DefaultAssignmentInfoFragmentDoc,
    "fragment DefaultAssignmentTypeInfo on AssignmentType {\n  id\n  name\n  description\n}":
        types.DefaultAssignmentTypeInfoFragmentDoc,
    "fragment ComponentListItemInfo on Component {\n  id\n  name\n  description\n  template {\n    id\n    name\n    description\n  }\n  ...OpenIssueCount\n}":
        types.ComponentListItemInfoFragmentDoc,
    "fragment DefaultComponentPermissionInfo on ComponentPermission {\n  id\n  name\n  description\n  entries\n  allUsers\n  users {\n    totalCount\n    nodes {\n      id\n      name: displayName\n    }\n  }\n}":
        types.DefaultComponentPermissionInfoFragmentDoc,
    "fragment DefaultComponentTemplateInfo on ComponentTemplate {\n  id\n  name\n  description\n  templateFieldSpecifications {\n    name\n    value\n  }\n}\n\nfragment DefaultComponentVersionTemplateInfo on ComponentVersionTemplate {\n  id\n  name\n  description\n  templateFieldSpecifications {\n    name\n    value\n  }\n}":
        types.DefaultComponentTemplateInfoFragmentDoc,
    "fragment ComponentVersionListItemInfo on ComponentVersion {\n  id\n  version\n  tags\n  interfaceDefinitions(filter: {visibleInterface: {}}) {\n    totalCount\n  }\n}\n\nfragment DefaultComponentVersionInfo on ComponentVersion {\n  id\n  component {\n    name\n    description\n  }\n  version\n  __typename\n}":
        types.ComponentVersionListItemInfoFragmentDoc,
    "fragment DefaultGlobalPermissionInfo on GlobalPermission {\n  id\n  name\n  description\n  entries\n  allUsers\n  users {\n    totalCount\n    nodes {\n      id\n      name: displayName\n    }\n  }\n}":
        types.DefaultGlobalPermissionInfoFragmentDoc,
    "fragment GraphInfo on Project {\n  components {\n    nodes {\n      ...GraphComponentVersionInfo\n    }\n  }\n  manageComponents: hasPermission(permission: MANAGE_COMPONENTS)\n  defaultView {\n    id\n  }\n}\n\nfragment GraphComponentVersionInfo on ComponentVersion {\n  version\n  ...GraphRelationPartnerInfo\n  interfaceDefinitions {\n    nodes {\n      visibleInterface {\n        ...GraphRelationPartnerInfo\n      }\n      interfaceSpecificationVersion {\n        id\n        version\n        interfaceSpecification {\n          id\n          name\n          template {\n            ...GraphRelationPartnerTemplateInfo\n          }\n        }\n      }\n    }\n  }\n  component {\n    id\n    name\n    template {\n      ...GraphRelationPartnerTemplateInfo\n    }\n  }\n  relateFromComponent: hasPermission(permission: RELATE_FROM_COMPONENT)\n}\n\nfragment GraphAggregatedIssueInfo on AggregatedIssue {\n  id\n  type {\n    id\n    name\n    iconPath\n  }\n  count\n  isOpen\n  outgoingRelations(filter: {end: {relationPartner: {partOfProject: $project}}}) {\n    nodes {\n      end {\n        id\n        relationPartner {\n          id\n        }\n      }\n      type {\n        name\n        id\n      }\n    }\n  }\n}\n\nfragment GraphRelationPartnerInfo on RelationPartner {\n  id\n  __typename\n  outgoingRelations(filter: {end: {partOfProject: $project}}) {\n    nodes {\n      id\n      template {\n        ...GraphRelationTemplateInfo\n      }\n      end {\n        id\n      }\n    }\n  }\n  aggregatedIssues {\n    nodes {\n      ...GraphAggregatedIssueInfo\n    }\n  }\n}\n\nfragment FillStyleInfo on FillStyle {\n  color\n}\n\nfragment StrokeStyleInfo on StrokeStyle {\n  color\n  dash\n}\n\nfragment GraphRelationPartnerTemplateInfo on RelationPartnerTemplate {\n  id\n  name\n  fill {\n    ...FillStyleInfo\n  }\n  stroke {\n    ...StrokeStyleInfo\n  }\n  shapeType\n  shapeRadius\n}\n\nfragment GraphRelationTemplateInfo on RelationTemplate {\n  name\n  stroke {\n    ...StrokeStyleInfo\n  }\n  markerType\n}":
        types.GraphInfoFragmentDoc,
    "fragment DefaultIMSInfo on IMS {\n  id\n  name\n  description\n}\n\nfragment IMSListItemInfo on IMS {\n  ...DefaultSyncPermissionTargetInfo\n  template {\n    id\n    name\n    description\n  }\n}":
        types.DefaultImsInfoFragmentDoc,
    "fragment DefaultIMSPermissionInfo on IMSPermission {\n  id\n  name\n  description\n  entries\n  allUsers\n  users {\n    totalCount\n    nodes {\n      id\n      name: displayName\n    }\n  }\n}":
        types.DefaultImsPermissionInfoFragmentDoc,
    "fragment DefaultIMSProjectInfo on IMSProject {\n  id\n  name\n  description\n  ims {\n    id\n    name\n    template {\n      id\n      name\n      description\n    }\n  }\n  ...DefaultSyncPermissionTargetInfo\n}":
        types.DefaultImsProjectInfoFragmentDoc,
    "fragment DefaultIMSTemplateInfo on IMSTemplate {\n  id\n  name\n  description\n  templateFieldSpecifications {\n    name\n    value\n  }\n}\n\nfragment DefaultIMSProjectTemplateInfo on IMSProjectTemplate {\n  id\n  name\n  description\n  templateFieldSpecifications {\n    name\n    value\n  }\n}":
        types.DefaultImsTemplateInfoFragmentDoc,
    "fragment DefaultInterfaceDefinitionInfo on InterfaceDefinition {\n  id\n  visibleSelfDefined\n  invisibleSelfDefined\n  visibleDerivedBy {\n    totalCount\n  }\n  invisibleDerivedBy {\n    totalCount\n  }\n}":
        types.DefaultInterfaceDefinitionInfoFragmentDoc,
    "fragment InterfaceSpecificationListItemInfo on InterfaceSpecification {\n  id\n  name\n  description\n  template {\n    id\n    name\n    description\n  }\n}\n\nfragment DefaultInterfaceSpecificationInfo on InterfaceSpecification {\n  id\n  name\n  description\n}":
        types.InterfaceSpecificationListItemInfoFragmentDoc,
    "fragment DefaultInterfaceSpecificationTemplateInfo on InterfaceSpecificationTemplate {\n  id\n  name\n  description\n  templateFieldSpecifications {\n    name\n    value\n  }\n}\n\nfragment DefaultInterfaceSpecificationVersionTemplateInfo on InterfaceSpecificationVersionTemplate {\n  id\n  name\n  description\n  templateFieldSpecifications {\n    name\n    value\n  }\n}":
        types.DefaultInterfaceSpecificationTemplateInfoFragmentDoc,
    "fragment InterfaceSpecificationVersionListItemInfo on InterfaceSpecificationVersion {\n  id\n  version\n  tags\n}\n\nfragment DefaultInterfaceSpecificationVersionInfo on InterfaceSpecificationVersion {\n  id\n  interfaceSpecification {\n    name\n    description\n  }\n  version\n  __typename\n}":
        types.InterfaceSpecificationVersionListItemInfoFragmentDoc,
    "fragment DefaultIssueInfo on Issue {\n  ...DefaultIssueIconInfo\n  id\n  title\n  trackables {\n    nodes {\n      ...DefaultTrackableInfo\n    }\n  }\n}\n\nfragment IssueListItemInfo on Issue {\n  id\n  title\n  createdAt\n  createdBy {\n    ...DefaultUserInfo\n  }\n  state {\n    id\n    name\n  }\n  ...DefaultIssueIconInfo\n  issueComments {\n    totalCount\n  }\n  labels {\n    nodes {\n      ...DefaultLabelInfo\n      trackables {\n        nodes {\n          id\n          name\n          description\n        }\n      }\n    }\n  }\n  assignments {\n    nodes {\n      user {\n        ...DefaultUserInfo\n      }\n    }\n  }\n  priority {\n    ...DefaultIssuePriorityInfo\n  }\n  template {\n    id\n    name\n    description\n  }\n  type {\n    id\n    name\n    iconPath\n  }\n  affects {\n    nodes {\n      id\n    }\n  }\n}\n\nfragment ParticipatingIssueListItemInfo on Issue {\n  ...IssueListItemInfo\n  trackables(first: 1) {\n    nodes {\n      __typename\n      id\n      name\n      description\n    }\n    totalCount\n  }\n}\n\nfragment ProjectComponentIssueListItemInfo on Issue {\n  ...IssueListItemInfo\n  trackables(\n    filter: {isComponentAnd: {versions: {any: {partOfProject: $project}}}}\n  ) {\n    nodes {\n      __typename\n      id\n      name\n      description\n    }\n    totalCount\n  }\n}\n\nfragment DefaultIssueIconInfo on Issue {\n  incomingRelations {\n    totalCount\n  }\n  outgoingRelations {\n    totalCount\n  }\n  state {\n    isOpen\n  }\n  type {\n    iconPath\n  }\n}":
        types.DefaultIssueInfoFragmentDoc,
    "fragment DefaultIssuePriorityInfo on IssuePriority {\n  id\n  name\n  description\n  value\n}":
        types.DefaultIssuePriorityInfoFragmentDoc,
    "fragment DefaultIssueRelationTypeInfo on IssueRelationType {\n  id\n  name\n  description\n}":
        types.DefaultIssueRelationTypeInfoFragmentDoc,
    "fragment DefaultIssueStateInfo on IssueState {\n  id\n  name\n  description\n  isOpen\n}":
        types.DefaultIssueStateInfoFragmentDoc,
    "fragment DefaultIssueTemplateInfo on IssueTemplate {\n  id\n  name\n  description\n  templateFieldSpecifications {\n    name\n    value\n  }\n}\n\nfragment IssueTemplateFields on IssueTemplate {\n  id\n  name\n  description\n  extends {\n    nodes {\n      id\n    }\n  }\n  issueTypes {\n    nodes {\n      name\n      description\n      iconPath\n    }\n  }\n  issuePriorities {\n    nodes {\n      name\n      description\n      value\n      iconPath\n    }\n  }\n  issueStates {\n    nodes {\n      name\n      description\n      isOpen\n    }\n  }\n  assignmentTypes {\n    nodes {\n      name\n      description\n    }\n  }\n  relationTypes {\n    nodes {\n      name\n      description\n      inverseName\n    }\n  }\n  templateFieldSpecifications {\n    name\n    value\n  }\n}":
        types.DefaultIssueTemplateInfoFragmentDoc,
    "fragment DefaultIssueTypeInfo on IssueType {\n  id\n  name\n  description\n  iconPath\n}":
        types.DefaultIssueTypeInfoFragmentDoc,
    "fragment DefaultLabelInfo on Label {\n  id\n  name\n  description\n  color\n}": types.DefaultLabelInfoFragmentDoc,
    "fragment BaseLegalInformationInfo on LegalInformation {\n  id\n  label\n  priority\n}\n\nfragment DefaultLegalInformationInfo on LegalInformation {\n  ...BaseLegalInformationInfo\n  text\n}":
        types.BaseLegalInformationInfoFragmentDoc,
    "fragment ProjectListItemInfo on Project {\n  id\n  name\n  description\n  ...OpenIssueCount\n}":
        types.ProjectListItemInfoFragmentDoc,
    "fragment DefaultProjectPermissionInfo on ProjectPermission {\n  id\n  name\n  description\n  entries\n  allUsers\n  users {\n    totalCount\n    nodes {\n      id\n      name: displayName\n    }\n  }\n}":
        types.DefaultProjectPermissionInfoFragmentDoc,
    "fragment DefaultRelationTemplateInfo on RelationTemplate {\n  id\n  name\n  description\n}":
        types.DefaultRelationTemplateInfoFragmentDoc,
    "fragment DefaultSyncPermissionTargetInfo on SyncPermissionTarget {\n  __typename\n  id\n  name\n  description\n  isSyncSelfAllowed\n  isSyncOthersAllowed\n}":
        types.DefaultSyncPermissionTargetInfoFragmentDoc,
    "fragment DefaultTimelineItemInfo on TimelineItem {\n  ... on AddedAffectedEntityEvent {\n    ...AddedAffectedEntityEventTimelineInfo\n  }\n  ... on AddedArtefactEvent {\n    ...AddedArtefactEventTimelineInfo\n  }\n  ... on AddedLabelEvent {\n    ...AddedLabelEventTimelineInfo\n  }\n  ... on AddedToPinnedIssuesEvent {\n    ...AddedToPinnedIssuesEventTimelineInfo\n  }\n  ... on AddedToTrackableEvent {\n    ...AddedToTrackableEventTimelineInfo\n  }\n  ... on Assignment {\n    ...AssignmentTimelineInfo\n  }\n  ... on AssignmentTypeChangedEvent {\n    ...AssignmentTypeChangedEventTimelineInfo\n  }\n  ... on Body {\n    ...BodyTimelineInfo\n  }\n  ... on IncomingRelationTypeChangedEvent {\n    ...IncomingRelationTypeChangedEventTimelineInfo\n  }\n  ... on IssueComment {\n    ...IssueCommentTimelineInfo\n  }\n  ... on IssueRelation {\n    ...IssueRelationTimelineInfo\n  }\n  ... on OutgoingRelationTypeChangedEvent {\n    ...OutgoingRelationTypeChangedEventTimelineInfo\n  }\n  ... on PriorityChangedEvent {\n    ...PriorityChangedEventTimelineInfo\n  }\n  ... on RelatedByIssueEvent {\n    ...RelatedByIssueEventTimelineInfo\n  }\n  ... on RemovedAffectedEntityEvent {\n    ...RemovedAffectedEntityEventTimelineInfo\n  }\n  ... on RemovedArtefactEvent {\n    ...RemovedArtefactEventTimelineInfo\n  }\n  ... on RemovedAssignmentEvent {\n    ...RemovedAssignmentEventTimelineInfo\n  }\n  ... on RemovedFromPinnedIssuesEvent {\n    ...RemovedFromPinnedIssuesEventTimelineInfo\n  }\n  ... on RemovedFromTrackableEvent {\n    ...RemovedFromTrackableEventTimelineInfo\n  }\n  ... on RemovedIncomingRelationEvent {\n    ...RemovedIncomingRelationEventTimelineInfo\n  }\n  ... on RemovedLabelEvent {\n    ...RemovedLabelEventTimelineInfo\n  }\n  ... on RemovedOutgoingRelationEvent {\n    ...RemovedOutgoingRelationEventTimelineInfo\n  }\n  ... on RemovedTemplatedFieldEvent {\n    ...RemovedTemplatedFieldEventTimelineInfo\n  }\n  ... on StateChangedEvent {\n    ...StateChangedEventTimelineInfo\n  }\n  ... on TemplateChangedEvent {\n    ...TemplateChangedEventTimelineInfo\n  }\n  ... on TemplatedFieldChangedEvent {\n    ...TemplatedFieldChangedEventTimelineInfo\n  }\n  ... on TitleChangedEvent {\n    ...TitleChangedEventTimelineInfo\n  }\n  ... on TypeChangedEvent {\n    ...TypeChangedEventTimelineInfo\n  }\n}\n\nfragment TimelineItemInfo on TimelineItem {\n  id\n  createdAt\n  __typename\n  createdBy {\n    ...UserTimelineInfo\n  }\n}\n\nfragment AddedAffectedEntityEventTimelineInfo on AddedAffectedEntityEvent {\n  ...TimelineItemInfo\n  addedAffectedEntity {\n    ...AffectedByIssueTimelineInfo\n  }\n}\n\nfragment AddedArtefactEventTimelineInfo on AddedArtefactEvent {\n  ...TimelineItemInfo\n  addedArtefact {\n    ...ArtefactTimelineInfo\n  }\n}\n\nfragment AddedLabelEventTimelineInfo on AddedLabelEvent {\n  ...TimelineItemInfo\n  addedLabel {\n    ...LabelTimelineInfo\n  }\n}\n\nfragment AddedToPinnedIssuesEventTimelineInfo on AddedToPinnedIssuesEvent {\n  ...TimelineItemInfo\n  pinnedOn {\n    ...TrackableTimelineInfo\n  }\n}\n\nfragment AddedToTrackableEventTimelineInfo on AddedToTrackableEvent {\n  ...TimelineItemInfo\n  addedToTrackable {\n    ...TrackableTimelineInfo\n  }\n}\n\nfragment AssignmentTimelineInfo on Assignment {\n  ...TimelineItemInfo\n  ...DefaultAssignmentInfo\n  initialType {\n    ...AssignmentTypeTimelineInfo\n  }\n}\n\nfragment AssignmentTypeChangedEventTimelineInfo on AssignmentTypeChangedEvent {\n  ...TimelineItemInfo\n  assignment {\n    ...AssignmentTimelineInfo\n  }\n  newAssignmentType: newType {\n    ...AssignmentTypeTimelineInfo\n  }\n  oldAssignmentType: oldType {\n    ...AssignmentTypeTimelineInfo\n  }\n}\n\nfragment BodyTimelineInfo on Body {\n  ...TimelineItemInfo\n  ...CommentTimelineInfo\n}\n\nfragment IncomingRelationTypeChangedEventTimelineInfo on IncomingRelationTypeChangedEvent {\n  ...RelationTypeChangedEventTimelineInfo\n  issueRelation {\n    ...IncomingRelationTimelineInfo\n  }\n}\n\nfragment IssueCommentTimelineInfo on IssueComment {\n  ...TimelineItemInfo\n  ...CommentTimelineInfo\n  isDeleted\n  answers {\n    id\n  }\n}\n\nfragment IssueRelationTimelineInfo on IssueRelation {\n  ...TimelineItemInfo\n  ...OutgoingRelationTimelineInfo\n}\n\nfragment OutgoingRelationTypeChangedEventTimelineInfo on OutgoingRelationTypeChangedEvent {\n  ...RelationTypeChangedEventTimelineInfo\n  issueRelation {\n    ...OutgoingRelationTimelineInfo\n  }\n}\n\nfragment PriorityChangedEventTimelineInfo on PriorityChangedEvent {\n  ...TimelineItemInfo\n  oldPriority {\n    ...IssuePriorityTimelineInfo\n  }\n  newPriority {\n    ...IssuePriorityTimelineInfo\n  }\n}\n\nfragment RelatedByIssueEventTimelineInfo on RelatedByIssueEvent {\n  ...TimelineItemInfo\n  relation {\n    ...IncomingRelationTimelineInfo\n  }\n}\n\nfragment RelationTypeChangedEventTimelineInfo on RelationTypeChangedEvent {\n  ...TimelineItemInfo\n  oldRelationType: oldType {\n    ...IssueRelationTypeTimelineInfo\n  }\n  newRelationType: newType {\n    ...IssueRelationTypeTimelineInfo\n  }\n}\n\nfragment RemovedAffectedEntityEventTimelineInfo on RemovedAffectedEntityEvent {\n  ...TimelineItemInfo\n  removedAffectedEntity {\n    ...AffectedByIssueTimelineInfo\n  }\n}\n\nfragment RemovedArtefactEventTimelineInfo on RemovedArtefactEvent {\n  ...TimelineItemInfo\n  removedArtefact {\n    ...ArtefactTimelineInfo\n  }\n}\n\nfragment RemovedAssignmentEventTimelineInfo on RemovedAssignmentEvent {\n  ...TimelineItemInfo\n  removedAssignment {\n    ...AssignmentTimelineInfo\n  }\n}\n\nfragment RemovedFromPinnedIssuesEventTimelineInfo on RemovedFromPinnedIssuesEvent {\n  ...TimelineItemInfo\n  unpinnedOn {\n    ...TrackableTimelineInfo\n  }\n}\n\nfragment RemovedFromTrackableEventTimelineInfo on RemovedFromTrackableEvent {\n  ...TimelineItemInfo\n  removedFromTrackable {\n    ...TrackableTimelineInfo\n  }\n}\n\nfragment RemovedIncomingRelationEventTimelineInfo on RemovedIncomingRelationEvent {\n  ...TimelineItemInfo\n  removedRelation {\n    ...IncomingRelationTimelineInfo\n  }\n}\n\nfragment RemovedLabelEventTimelineInfo on RemovedLabelEvent {\n  ...TimelineItemInfo\n  removedLabel {\n    ...LabelTimelineInfo\n  }\n}\n\nfragment RemovedOutgoingRelationEventTimelineInfo on RemovedOutgoingRelationEvent {\n  ...TimelineItemInfo\n  removedRelation {\n    ...OutgoingRelationTimelineInfo\n  }\n}\n\nfragment RemovedTemplatedFieldEventTimelineInfo on RemovedTemplatedFieldEvent {\n  ...TimelineItemInfo\n  fieldName\n}\n\nfragment StateChangedEventTimelineInfo on StateChangedEvent {\n  ...TimelineItemInfo\n  oldState {\n    ...IssueStateTimelineInfo\n  }\n  newState {\n    ...IssueStateTimelineInfo\n  }\n}\n\nfragment TemplateChangedEventTimelineInfo on TemplateChangedEvent {\n  ...TimelineItemInfo\n  oldTemplate {\n    ...IssueTemplateTimelineInfo\n  }\n  newTemplate {\n    ...IssueTemplateTimelineInfo\n  }\n}\n\nfragment TemplatedFieldChangedEventTimelineInfo on TemplatedFieldChangedEvent {\n  ...TimelineItemInfo\n  fieldName\n  oldValue\n  newValue\n}\n\nfragment TitleChangedEventTimelineInfo on TitleChangedEvent {\n  ...TimelineItemInfo\n  oldTitle\n  newTitle\n}\n\nfragment TypeChangedEventTimelineInfo on TypeChangedEvent {\n  ...TimelineItemInfo\n  newIssueType: newType {\n    ...IssueTypeTimelineInfo\n  }\n  oldIssueType: oldType {\n    ...IssueTypeTimelineInfo\n  }\n}\n\nfragment IssueTypeTimelineInfo on IssueType {\n  ...DefaultIssueTypeInfo\n}\n\nfragment AffectedByIssueTimelineInfo on AffectedByIssue {\n  ...DefaultAffectedByIssueInfo\n}\n\nfragment ArtefactTimelineInfo on Artefact {\n  file\n  id\n}\n\nfragment UserTimelineInfo on User {\n  ...DefaultUserInfo\n}\n\nfragment LabelTimelineInfo on Label {\n  ...DefaultLabelInfo\n}\n\nfragment TrackableTimelineInfo on Trackable {\n  ...DefaultTrackableInfo\n}\n\nfragment AssignmentTypeTimelineInfo on AssignmentType {\n  ...DefaultAssignmentTypeInfo\n}\n\nfragment CommentTimelineInfo on Comment {\n  body\n  bodyLastEditedAt\n  bodyLastEditedBy {\n    ...UserTimelineInfo\n  }\n}\n\nfragment IssueRelationTypeTimelineInfo on IssueRelationType {\n  id\n  name\n  inverseName\n  description\n}\n\nfragment IssueRelationTimelineInfoBase on IssueRelation {\n  type {\n    ...IssueRelationTypeTimelineInfo\n  }\n  initialType {\n    ...IssueRelationTypeTimelineInfo\n  }\n}\n\nfragment IncomingRelationTimelineInfo on IssueRelation {\n  id\n  ...IssueRelationTimelineInfoBase\n  issue {\n    ...IssueTimelineInfo\n  }\n}\n\nfragment OutgoingRelationTimelineInfo on IssueRelation {\n  id\n  ...IssueRelationTimelineInfoBase\n  relatedIssue {\n    ...IssueTimelineInfo\n  }\n}\n\nfragment IssueTimelineInfo on Issue {\n  ...DefaultIssueInfo\n}\n\nfragment IssuePriorityTimelineInfo on IssuePriority {\n  ...DefaultIssuePriorityInfo\n}\n\nfragment IssueStateTimelineInfo on IssueState {\n  ...DefaultIssueStateInfo\n}\n\nfragment IssueTemplateTimelineInfo on IssueTemplate {\n  name\n  description\n}":
        types.DefaultTimelineItemInfoFragmentDoc,
    "fragment OpenIssueCount on Trackable {\n  openIssues: issues(filter: {state: {isOpen: {eq: true}}}) {\n    totalCount\n  }\n}\n\nfragment DefaultTrackableInfo on Trackable {\n  __typename\n  id\n  name\n  description\n}":
        types.OpenIssueCountFragmentDoc,
    "fragment DefaultUserInfo on User {\n  id\n  username\n  displayName\n  avatar\n}\n\nfragment CurrentUserInfo on User {\n  ...DefaultUserInfo\n  email\n  ... on GropiusUser {\n    isAdmin\n  }\n}":
        types.DefaultUserInfoFragmentDoc,
    "fragment DefaultViewInfo on View {\n  id\n  name\n  description\n  filterByTemplate {\n    nodes {\n      id\n      name\n    }\n  }\n}\n\nfragment ViewGraphInfo on View {\n  ...DefaultViewInfo\n  relationLayouts {\n    nodes {\n      relation {\n        id\n      }\n      points {\n        x\n        y\n      }\n    }\n  }\n  relationPartnerLayouts {\n    nodes {\n      relationPartner {\n        id\n      }\n      pos {\n        x\n        y\n      }\n    }\n  }\n}":
        types.DefaultViewInfoFragmentDoc,
    "\n    query getCurrentUser {\n        currentUser {\n            ...CurrentUserInfo\n        }\n\n        canCreateProjects: hasGlobalPermission(permission: CAN_CREATE_PROJECTS)\n        canCreateComponents: hasGlobalPermission(permission: CAN_CREATE_COMPONENTS)\n        canCreateIMSs: hasGlobalPermission(permission: CAN_CREATE_IMSS)\n        canCreateTemplates: hasGlobalPermission(permission: CAN_CREATE_TEMPLATES)\n    }\n":
        types.GetCurrentUserDocument,
    "\n    query legalInformation {\n        legalInformation(orderBy: [{ field: PRIORITY, direction: ASC }]) {\n            nodes {\n                ...BaseLegalInformationInfo\n            }\n        }\n    }\n":
        types.LegalInformationDocument,
    "\n    query getLegalInformation($id: ID!) {\n        node(id: $id) {\n            __typename\n            ... on LegalInformation {\n                ...DefaultLegalInformationInfo\n            }\n        }\n    }\n":
        types.GetLegalInformationDocument,
    "\n    query getUser($id: ID!) {\n        node(id: $id) {\n            ... on User {\n                ...DefaultUserInfo\n            }\n        }\n    }\n":
        types.GetUserDocument,
    "\n    query getLegalInformationList($orderBy: [LegalInformationOrder!], $count: Int!, $skip: Int!) {\n        legalInformation(orderBy: $orderBy, first: $count, skip: $skip) {\n            nodes {\n                ...DefaultLegalInformationInfo\n            }\n            totalCount\n        }\n    }\n":
        types.GetLegalInformationListDocument,
    "\n    query getFilteredLegalInformationList($query: String!, $count: Int!) {\n        searchLegalInformation(query: $query, first: $count) {\n            ...DefaultLegalInformationInfo\n        }\n    }\n":
        types.GetFilteredLegalInformationListDocument,
    "\n    mutation deleteLegalInformation($id: ID!) {\n        deleteLegalInformation(input: { id: $id }) {\n            __typename\n        }\n    }\n":
        types.DeleteLegalInformationDocument,
    "\n    query getGlobalPermissionList(\n        $orderBy: [GlobalPermissionOrder!]!\n        $count: Int!\n        $skip: Int!\n        $filter: GlobalPermissionFilterInput\n    ) {\n        globalPermissions(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n            nodes {\n                ...DefaultGlobalPermissionInfo\n            }\n            totalCount\n        }\n    }\n":
        types.GetGlobalPermissionListDocument,
    "\n    query getFilteredGlobalPermissionList($query: String!, $count: Int!, $filter: GlobalPermissionFilterInput!) {\n        searchGlobalPermissions(query: $query, first: $count, filter: $filter) {\n            ...DefaultGlobalPermissionInfo\n        }\n    }\n":
        types.GetFilteredGlobalPermissionListDocument,
    "\n    mutation deleteGlobalPermission($globalPermission: ID!) {\n        deleteGlobalPermission(input: { id: $globalPermission }) {\n            __typename\n        }\n    }\n":
        types.DeleteGlobalPermissionDocument,
    "\n    mutation updateGlobalPermission($input: UpdateGlobalPermissionInput!) {\n        updateGlobalPermission(input: $input) {\n            __typename\n        }\n    }\n":
        types.UpdateGlobalPermissionDocument,
    "\n    mutation createGlobalPermission($input: CreateGlobalPermissionInput!) {\n        createGlobalPermission(input: $input) {\n            globalPermission {\n                id\n            }\n        }\n    }\n":
        types.CreateGlobalPermissionDocument,
    "\n    query getComponentDetails($id: ID!) {\n        node(id: $id) {\n            id\n            ... on Component {\n                name\n                description\n                issues(orderBy: [{ field: LAST_UPDATED_AT, direction: DESC }], first: 20) {\n                    nodes {\n                        ...IssueListItemInfo\n                    }\n                }\n                pinnedIssues {\n                    nodes {\n                        ...IssueListItemInfo\n                    }\n                }\n            }\n        }\n    }\n":
        types.GetComponentDetailsDocument,
    "\n    query getComponent($id: ID!) {\n        node(id: $id) {\n            id\n            ... on Component {\n                __typename\n                name\n                description\n                ...OpenIssueCount\n                createIssues: hasPermission(permission: CREATE_ISSUES)\n                manageLabels: hasPermission(permission: MANAGE_LABELS)\n                manageIssues: hasPermission(permission: MANAGE_ISSUES)\n                manageIMS: hasPermission(permission: MANAGE_IMS)\n                admin: hasPermission(permission: ADMIN)\n            }\n        }\n    }\n":
        types.GetComponentDocument,
    "\n    query getVersionedNode($id: ID!) {\n        node(id: $id) {\n            id\n            ... on Versioned {\n                version\n            }\n        }\n    }\n":
        types.GetVersionedNodeDocument,
    "\n    query getNamedNodeComponent($id: ID!) {\n        node(id: $id) {\n            id\n            ... on Named {\n                name\n            }\n        }\n    }\n":
        types.GetNamedNodeComponentDocument,
    "\n    mutation deleteComponent($id: ID!) {\n        deleteComponent(input: { id: $id }) {\n            __typename\n        }\n    }\n":
        types.DeleteComponentDocument,
    "\n    query getComponentGeneralDetails($id: ID!) {\n        node(id: $id) {\n            id\n            ... on Component {\n                name\n                description\n                repositoryURL\n                templatedFields {\n                    name\n                    value\n                }\n                template {\n                    templateFieldSpecifications {\n                        name\n                        value\n                    }\n                }\n                admin: hasPermission(permission: ADMIN)\n            }\n        }\n    }\n":
        types.GetComponentGeneralDetailsDocument,
    "\n    mutation updateComponent($input: UpdateComponentInput!) {\n        updateComponent(input: $input) {\n            component {\n                id\n            }\n        }\n    }\n":
        types.UpdateComponentDocument,
    "\n    query getComponentTemplateDetails($id: ID!) {\n        node(id: $id) {\n            id\n            ... on Component {\n                template {\n                    id\n                }\n            }\n        }\n    }\n":
        types.GetComponentTemplateDetailsDocument,
    "\n    query getInterfaceSpecificationList(\n        $orderBy: [InterfaceSpecificationOrder!]!\n        $count: Int!\n        $skip: Int!\n        $component: ID!\n        $filter: InterfaceSpecificationFilterInput!\n    ) {\n        node(id: $component) {\n            ... on Component {\n                interfaceSpecifications(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n                    nodes {\n                        ...InterfaceSpecificationListItemInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n":
        types.GetInterfaceSpecificationListDocument,
    "\n    query getFilteredInterfaceSpecificationList(\n        $query: String!\n        $count: Int!\n        $filter: InterfaceSpecificationFilterInput!\n    ) {\n        searchInterfaceSpecifications(query: $query, first: $count, filter: $filter) {\n            ...InterfaceSpecificationListItemInfo\n        }\n    }\n":
        types.GetFilteredInterfaceSpecificationListDocument,
    "\n    query searchInterfaceSpecificationTemplatesForComponentInterfaces($query: String!, $count: Int!) {\n        searchInterfaceSpecificationTemplates(query: $query, first: $count) {\n            id\n            name\n            description\n        }\n    }\n":
        types.SearchInterfaceSpecificationTemplatesForComponentInterfacesDocument,
    "\n    query getComponentPermissionList(\n        $orderBy: [ComponentPermissionOrder!]!\n        $count: Int!\n        $skip: Int!\n        $component: ID!\n        $filter: ComponentPermissionFilterInput!\n    ) {\n        node(id: $component) {\n            ... on Component {\n                permissions(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n                    nodes {\n                        ...DefaultComponentPermissionInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n":
        types.GetComponentPermissionListDocument,
    "\n    query getFilteredComponentPermissionList($query: String!, $count: Int!, $filter: ComponentPermissionFilterInput!) {\n        searchComponentPermissions(query: $query, first: $count, filter: $filter) {\n            ...DefaultComponentPermissionInfo\n        }\n    }\n":
        types.GetFilteredComponentPermissionListDocument,
    "\n    mutation removeComponentPermissionFromComponent($component: ID!, $componentPermission: ID!) {\n        updateComponent(input: { id: $component, removedPermissions: [$componentPermission] }) {\n            __typename\n        }\n    }\n":
        types.RemoveComponentPermissionFromComponentDocument,
    "\n    mutation updateComponentPermission($input: UpdateComponentPermissionInput!) {\n        updateComponentPermission(input: $input) {\n            __typename\n        }\n    }\n":
        types.UpdateComponentPermissionDocument,
    "\n    mutation createComponentPermission($input: CreateComponentPermissionInput!) {\n        createComponentPermission(input: $input) {\n            componentPermission {\n                id\n            }\n        }\n    }\n":
        types.CreateComponentPermissionDocument,
    "\n    mutation deleteInterfaceSpecification($id: ID!) {\n        deleteInterfaceSpecification(input: { id: $id }) {\n            __typename\n        }\n    }\n":
        types.DeleteInterfaceSpecificationDocument,
    "\n    query getInterfaceSpecificationGeneralDetails($id: ID!) {\n        node(id: $id) {\n            id\n            ... on InterfaceSpecification {\n                name\n                description\n                templatedFields {\n                    name\n                    value\n                }\n                template {\n                    templateFieldSpecifications {\n                        name\n                        value\n                    }\n                }\n            }\n        }\n    }\n":
        types.GetInterfaceSpecificationGeneralDetailsDocument,
    "\n    mutation updateInterfaceSpecification($input: UpdateInterfaceSpecificationInput!) {\n        updateInterfaceSpecification(input: $input) {\n            interfaceSpecification {\n                id\n            }\n        }\n    }\n":
        types.UpdateInterfaceSpecificationDocument,
    "\n    mutation deleteInterfaceSpecificationVersion($id: ID!) {\n        deleteInterfaceSpecificationVersion(input: { id: $id }) {\n            __typename\n        }\n    }\n":
        types.DeleteInterfaceSpecificationVersionDocument,
    "\n    query getInterfaceSpecificationVersionGeneralDetails($id: ID!) {\n        node(id: $id) {\n            id\n            ... on InterfaceSpecificationVersion {\n                version\n                tags\n                templatedFields {\n                    name\n                    value\n                }\n                template {\n                    templateFieldSpecifications {\n                        name\n                        value\n                    }\n                }\n            }\n        }\n    }\n":
        types.GetInterfaceSpecificationVersionGeneralDetailsDocument,
    "\n    mutation updateInterfaceSpecificationVersion($input: UpdateInterfaceSpecificationVersionInput!) {\n        updateInterfaceSpecificationVersion(input: $input) {\n            interfaceSpecificationVersion {\n                id\n            }\n        }\n    }\n":
        types.UpdateInterfaceSpecificationVersionDocument,
    "\n    query getInterfaceSpecificationVersionList(\n        $orderBy: [InterfaceSpecificationVersionOrder!]!\n        $count: Int!\n        $skip: Int!\n        $interfaceSpecification: ID!\n    ) {\n        node(id: $interfaceSpecification) {\n            ... on InterfaceSpecification {\n                versions(orderBy: $orderBy, first: $count, skip: $skip) {\n                    nodes {\n                        ...InterfaceSpecificationVersionListItemInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n":
        types.GetInterfaceSpecificationVersionListDocument,
    "\n    query getFilteredInterfaceSpecificationVersionList($query: String!, $count: Int!, $interfaceSpecification: ID!) {\n        searchInterfaceSpecificationVersions(\n            query: $query\n            first: $count\n            filter: { interfaceSpecification: { id: { eq: $interfaceSpecification } } }\n        ) {\n            ...InterfaceSpecificationVersionListItemInfo\n        }\n    }\n":
        types.GetFilteredInterfaceSpecificationVersionListDocument,
    "\n    mutation deleteComponentVersion($id: ID!) {\n        deleteComponentVersion(input: { id: $id }) {\n            __typename\n        }\n    }\n":
        types.DeleteComponentVersionDocument,
    "\n    query getComponentVersionGeneralDetails($id: ID!) {\n        node(id: $id) {\n            id\n            ... on ComponentVersion {\n                version\n                tags\n                templatedFields {\n                    name\n                    value\n                }\n                template {\n                    templateFieldSpecifications {\n                        name\n                        value\n                    }\n                }\n            }\n        }\n    }\n":
        types.GetComponentVersionGeneralDetailsDocument,
    "\n    mutation updateComponentVersion($input: UpdateComponentVersionInput!) {\n        updateComponentVersion(input: $input) {\n            componentVersion {\n                id\n            }\n        }\n    }\n":
        types.UpdateComponentVersionDocument,
    "\n    query getInterfaceDefinitionList(\n        $orderBy: [InterfaceDefinitionOrder!]!\n        $count: Int!\n        $skip: Int!\n        $componentVersion: ID!\n        $filter: InterfaceDefinitionFilterInput!\n    ) {\n        node(id: $componentVersion) {\n            ... on ComponentVersion {\n                interfaceDefinitions(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n                    nodes {\n                        ...DefaultInterfaceDefinitionInfo\n                        interfaceSpecificationVersion {\n                            id\n                            version\n                            interfaceSpecification {\n                                id\n                                name\n                                description\n                                template {\n                                    id\n                                    name\n                                    description\n                                }\n                            }\n                        }\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n":
        types.GetInterfaceDefinitionListDocument,
    "\n    query getFilteredInterfaceDefinitionList(\n        $query: String!\n        $count: Int!\n        $specificationFilter: InterfaceSpecificationFilterInput!\n        $versionFilter: InterfaceSpecificationVersionFilterInput!\n        $definitionFilter: InterfaceDefinitionFilterInput!\n    ) {\n        searchInterfaceSpecifications(query: $query, first: $count, filter: $specificationFilter) {\n            id\n            name\n            description\n            template {\n                id\n                name\n                description\n            }\n            versions(filter: $versionFilter, first: $count) {\n                nodes {\n                    id\n                    version\n                    interfaceDefinitions(filter: $definitionFilter) {\n                        nodes {\n                            ...DefaultInterfaceDefinitionInfo\n                        }\n                    }\n                }\n            }\n        }\n    }\n":
        types.GetFilteredInterfaceDefinitionListDocument,
    "\n    query searchInterfaceSpecificationsForVersionInterfaces($query: String!, $count: Int!, $component: ID!) {\n        searchInterfaceSpecifications(query: $query, first: $count, filter: { component: { id: { eq: $component } } }) {\n            id\n            name\n            description\n        }\n    }\n":
        types.SearchInterfaceSpecificationsForVersionInterfacesDocument,
    "\n    query searchInterfaceSpecificationTemplatesForVersionInterfaces($query: String!, $count: Int!) {\n        searchInterfaceSpecificationTemplates(query: $query, first: $count) {\n            id\n            name\n            description\n        }\n    }\n":
        types.SearchInterfaceSpecificationTemplatesForVersionInterfacesDocument,
    "\n    mutation removeInterfaceSpecificationVersionFromComponentVersion(\n        $input: RemoveInterfaceSpecificationVersionFromComponentVersionInput!\n    ) {\n        removeInterfaceSpecificationVersionFromComponentVersion(input: $input) {\n            __typename\n        }\n    }\n":
        types.RemoveInterfaceSpecificationVersionFromComponentVersionDocument,
    "\n    query getComponentVersionList($orderBy: [ComponentVersionOrder!]!, $count: Int!, $skip: Int!, $component: ID!) {\n        node(id: $component) {\n            ... on Component {\n                versions(orderBy: $orderBy, first: $count, skip: $skip) {\n                    nodes {\n                        ...ComponentVersionListItemInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n":
        types.GetComponentVersionListDocument,
    "\n    query getFilteredComponentVersionList($query: String!, $count: Int!, $component: ID!) {\n        searchComponentVersions(query: $query, first: $count, filter: { component: { id: { eq: $component } } }) {\n            ...ComponentVersionListItemInfo\n        }\n    }\n":
        types.GetFilteredComponentVersionListDocument,
    "\n    query getComponentList($orderBy: [ComponentOrder!]!, $count: Int!, $skip: Int!, $filter: ComponentFilterInput!) {\n        components(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n            nodes {\n                ...ComponentListItemInfo\n            }\n            totalCount\n        }\n    }\n":
        types.GetComponentListDocument,
    "\n    query getFilteredComponentList($query: String!, $count: Int!, $filter: ComponentFilterInput!) {\n        searchComponents(query: $query, first: $count, filter: $filter) {\n            ...ComponentListItemInfo\n        }\n    }\n":
        types.GetFilteredComponentListDocument,
    "\n    query searchComponentTemplates($query: String!, $count: Int!) {\n        searchComponentTemplates(query: $query, first: $count) {\n            id\n            name\n        }\n    }\n":
        types.SearchComponentTemplatesDocument,
    "\n    query getParticipatingIssueList($orderBy: [IssueOrder!]!, $count: Int!, $skip: Int!, $filter: IssueFilterInput) {\n        currentUser {\n            participatedIssues(filter: $filter, orderBy: $orderBy, first: $count, skip: $skip) {\n                nodes {\n                    ...ParticipatingIssueListItemInfo\n                }\n                totalCount\n            }\n        }\n    }\n":
        types.GetParticipatingIssueListDocument,
    "\n    query getParticipatingFilteredIssueList($query: String!, $count: Int!, $filter: IssueFilterInput) {\n        searchIssues(query: $query, first: $count, filter: $filter) {\n            ...ParticipatingIssueListItemInfo\n        }\n    }\n":
        types.GetParticipatingFilteredIssueListDocument,
    "\n    query getIMSList($orderBy: [IMSOrder!]!, $count: Int!, $skip: Int!, $filter: IMSFilterInput!) {\n        imss(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n            nodes {\n                ...IMSListItemInfo\n            }\n            totalCount\n        }\n    }\n":
        types.GetImsListDocument,
    "\n    query getFilteredIMSList($query: String!, $count: Int!, $filter: IMSFilterInput) {\n        searchIMSs(query: $query, first: $count, filter: $filter) {\n            ...IMSListItemInfo\n        }\n    }\n":
        types.GetFilteredImsListDocument,
    "\n    query searchIMSTemplates($query: String!, $count: Int!) {\n        searchIMSTemplates(query: $query, first: $count) {\n            id\n            name\n        }\n    }\n":
        types.SearchImsTemplatesDocument,
    "\n    query getProjectList($orderBy: [ProjectOrder!]!, $count: Int!, $skip: Int!) {\n        projects(orderBy: $orderBy, first: $count, skip: $skip) {\n            nodes {\n                ...ProjectListItemInfo\n            }\n            totalCount\n        }\n    }\n":
        types.GetProjectListDocument,
    "\n    query getFilteredProjectList($query: String!, $count: Int!) {\n        searchProjects(query: $query, first: $count) {\n            ...ProjectListItemInfo\n        }\n    }\n":
        types.GetFilteredProjectListDocument,
    "\n    query getIssueTemplateList($orderBy: [IssueTemplateOrder!]!, $count: Int!, $skip: Int!, $isDeprecated: Boolean!) {\n        issueTemplates(orderBy: $orderBy, first: $count, skip: $skip, filter: { isDeprecated: { eq: $isDeprecated } }) {\n            nodes {\n                ...DefaultIssueTemplateInfo\n            }\n            totalCount\n        }\n    }\n":
        types.GetIssueTemplateListDocument,
    "\n    query getFilteredIssueTemplateList($query: String!, $count: Int!, $isDeprecated: Boolean!) {\n        searchIssueTemplates(query: $query, first: $count, filter: { isDeprecated: { eq: $isDeprecated } }) {\n            ...DefaultIssueTemplateInfo\n        }\n    }\n":
        types.GetFilteredIssueTemplateListDocument,
    "\n    query getIssueTemplateDeprecationStatus($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on IssueTemplate {\n                isDeprecated\n            }\n        }\n    }\n":
        types.GetIssueTemplateDeprecationStatusDocument,
    "\n    mutation updateIssueTemplateDeprecationStatus($id: ID!, $isDeprecated: Boolean!) {\n        updateTemplateDeprecationStatus(input: { id: $id, isDeprecated: $isDeprecated }) {\n            template {\n                id\n                isDeprecated\n            }\n        }\n    }\n":
        types.UpdateIssueTemplateDeprecationStatusDocument,
    "\n    query getIssueTemplateGeneralDetails($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on IssueTemplate {\n                name\n                description\n                isDeprecated\n            }\n        }\n    }\n":
        types.GetIssueTemplateGeneralDetailsDocument,
    "\n    mutation updateIssueTemplate($input: UpdateIssueTemplateInput!) {\n        updateIssueTemplate(input: $input) {\n            issueTemplate {\n                id\n            }\n        }\n    }\n":
        types.UpdateIssueTemplateDocument,
    "\n    query getIssueTemplateIssueAttributes($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on IssueTemplate {\n                issueTypes {\n                    nodes {\n                        id\n                        name\n                        description\n                        iconPath\n                        partOf {\n                            totalCount\n                        }\n                    }\n                }\n                issuePriorities {\n                    nodes {\n                        id\n                        name\n                        description\n                        value\n                        iconPath\n                        partOf {\n                            totalCount\n                        }\n                    }\n                }\n                issueStates {\n                    nodes {\n                        id\n                        name\n                        description\n                        isOpen\n                        partOf {\n                            totalCount\n                        }\n                    }\n                }\n            }\n        }\n    }\n":
        types.GetIssueTemplateIssueAttributesDocument,
    "\n    query getIssueTemplateLinkageAttributes($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on IssueTemplate {\n                assignmentTypes {\n                    nodes {\n                        id\n                        name\n                        description\n                        partOf {\n                            totalCount\n                        }\n                    }\n                }\n                relationTypes {\n                    nodes {\n                        id\n                        name\n                        description\n                        inverseName\n                        partOf {\n                            totalCount\n                        }\n                    }\n                }\n            }\n        }\n    }\n":
        types.GetIssueTemplateLinkageAttributesDocument,
    "\n    query getIssueTemplate($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on IssueTemplate {\n                name\n                description\n            }\n        }\n    }\n":
        types.GetIssueTemplateDocument,
    "\n    query getIssueTemplateFieldSpecifications($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on IssueTemplate {\n                templateFieldSpecifications {\n                    name\n                    value\n                }\n            }\n        }\n    }\n":
        types.GetIssueTemplateFieldSpecificationsDocument,
    "\n    query getIMS($id: ID!) {\n        node(id: $id) {\n            __typename\n            ... on IMS {\n                name\n                description\n                syncTrackables: hasPermission(permission: SYNC_TRACKABLES)\n                admin: hasPermission(permission: ADMIN)\n            }\n        }\n    }\n":
        types.GetImsDocument,
    "\n    query getNamedNode($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on Named {\n                name\n            }\n        }\n    }\n":
        types.GetNamedNodeDocument,
    "\n    mutation deleteIMS($id: ID!) {\n        deleteIMS(input: { id: $id }) {\n            __typename\n        }\n    }\n":
        types.DeleteImsDocument,
    "\n    query getIMSGeneralDetails($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on IMS {\n                name\n                description\n                templatedFields {\n                    name\n                    value\n                }\n                template {\n                    templateFieldSpecifications {\n                        name\n                        value\n                    }\n                }\n                admin: hasPermission(permission: ADMIN)\n            }\n        }\n    }\n":
        types.GetImsGeneralDetailsDocument,
    "\n    mutation updateIMS($input: UpdateIMSInput!) {\n        updateIMS(input: $input) {\n            ims {\n                id\n            }\n        }\n    }\n":
        types.UpdateImsDocument,
    "\n    query getIMSPermissionList(\n        $orderBy: [IMSPermissionOrder!]!\n        $count: Int!\n        $skip: Int!\n        $ims: ID!\n        $filter: IMSPermissionFilterInput!\n    ) {\n        node(id: $ims) {\n            __typename\n            ... on IMS {\n                permissions(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n                    nodes {\n                        ...DefaultIMSPermissionInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n":
        types.GetImsPermissionListDocument,
    "\n    query getFilteredIMSPermissionList($query: String!, $count: Int!, $filter: IMSPermissionFilterInput!) {\n        searchIMSPermissions(query: $query, first: $count, filter: $filter) {\n            ...DefaultIMSPermissionInfo\n        }\n    }\n":
        types.GetFilteredImsPermissionListDocument,
    "\n    mutation removeIMSPermissionFromIMS($ims: ID!, $imsPermission: ID!) {\n        updateIMS(input: { id: $ims, removedPermissions: [$imsPermission] }) {\n            __typename\n        }\n    }\n":
        types.RemoveImsPermissionFromImsDocument,
    "\n    mutation updateIMSPermission($input: UpdateIMSPermissionInput!) {\n        updateIMSPermission(input: $input) {\n            __typename\n        }\n    }\n":
        types.UpdateImsPermissionDocument,
    "\n    mutation createIMSPermission($input: CreateIMSPermissionInput!) {\n        createIMSPermission(input: $input) {\n            imsPermission {\n                id\n            }\n        }\n    }\n":
        types.CreateImsPermissionDocument,
    "\n    mutation deleteIMSProject($id: ID!) {\n        deleteIMSProject(input: { id: $id }) {\n            __typename\n        }\n    }\n":
        types.DeleteImsProjectDocument,
    "\n    query getIMSProjectGeneralDetails($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on IMSProject {\n                name\n                description\n                templatedFields {\n                    name\n                    value\n                }\n                template {\n                    templateFieldSpecifications {\n                        name\n                        value\n                    }\n                }\n                ims {\n                    syncTrackables: hasPermission(permission: SYNC_TRACKABLES)\n                }\n                trackable {\n                    manageIMS: hasPermission(permission: MANAGE_IMS)\n                }\n            }\n        }\n    }\n":
        types.GetImsProjectGeneralDetailsDocument,
    "\n    mutation updateIMSProject($input: UpdateIMSProjectInput!) {\n        updateIMSProject(input: $input) {\n            imsProject {\n                id\n            }\n        }\n    }\n":
        types.UpdateImsProjectDocument,
    "\n    query getIMSProjectListFromIMS($orderBy: [IMSProjectOrder!]!, $count: Int!, $skip: Int!, $ims: ID!) {\n        node(id: $ims) {\n            __typename\n            ... on IMS {\n                projects(orderBy: $orderBy, first: $count, skip: $skip) {\n                    nodes {\n                        ...DefaultIMSProjectInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n":
        types.GetImsProjectListFromImsDocument,
    "\n    query getFilteredIMSProjectList($query: String!, $count: Int!, $filter: IMSProjectFilterInput!) {\n        searchIMSProjects(query: $query, first: $count, filter: $filter) {\n            ...DefaultIMSProjectInfo\n        }\n    }\n":
        types.GetFilteredImsProjectListDocument,
    "\n    query getIssue($id: ID!) {\n        node(id: $id) {\n            __typename\n            ... on Issue {\n                id\n                title\n                createdBy {\n                    ...DefaultUserInfo\n                }\n                createdAt\n                lastUpdatedAt\n                timelineItems(orderBy: [{ field: CREATED_AT }]) {\n                    nodes {\n                        ...DefaultTimelineItemInfo\n                    }\n                }\n                artefacts {\n                    nodes {\n                        ...ArtefactTimelineInfo\n                    }\n                }\n                outgoingRelations {\n                    nodes {\n                        id\n                        ...OutgoingRelationTimelineInfo\n                    }\n                    totalCount\n                }\n                incomingRelations {\n                    nodes {\n                        id\n                        ...IncomingRelationTimelineInfo\n                    }\n                    totalCount\n                }\n                labels {\n                    nodes {\n                        ...DefaultLabelInfo\n                    }\n                }\n                affects {\n                    nodes {\n                        ...AffectedByIssueTimelineInfo\n                    }\n                }\n                assignments {\n                    nodes {\n                        ...AssignmentTimelineInfo\n                    }\n                }\n                type {\n                    ...DefaultIssueTypeInfo\n                }\n                state {\n                    ...DefaultIssueStateInfo\n                }\n                priority {\n                    ...DefaultIssuePriorityInfo\n                }\n                trackables {\n                    nodes {\n                        ...DefaultTrackableInfo\n                    }\n                }\n                templatedFields {\n                    name\n                    value\n                }\n                template {\n                    ...DefaultIssueTemplateInfo\n                }\n                manageIssues: hasPermission(permission: MANAGE_ISSUES)\n                comment: hasPermission(permission: COMMENT)\n                moderator: hasPermission(permission: MODERATOR)\n                exportIssues: hasPermission(permission: EXPORT_ISSUES)\n            }\n        }\n    }\n":
        types.GetIssueDocument,
    "\n    mutation changeIssueType($issue: ID!, $type: ID!) {\n        changeIssueType(input: { issue: $issue, type: $type }) {\n            typeChangedEvent {\n                ...TypeChangedEventTimelineInfo\n            }\n        }\n    }\n":
        types.ChangeIssueTypeDocument,
    "\n    mutation changeIssueState($issue: ID!, $state: ID!) {\n        changeIssueState(input: { issue: $issue, state: $state }) {\n            stateChangedEvent {\n                ...StateChangedEventTimelineInfo\n            }\n        }\n    }\n":
        types.ChangeIssueStateDocument,
    "\n    mutation changeIssuePriority($issue: ID!, $priority: ID!) {\n        changeIssuePriority(input: { issue: $issue, priority: $priority }) {\n            priorityChangedEvent {\n                ...PriorityChangedEventTimelineInfo\n            }\n        }\n    }\n":
        types.ChangeIssuePriorityDocument,
    "\n    mutation addLabelToIssue($issue: ID!, $label: ID!) {\n        addLabelToIssue(input: { issue: $issue, label: $label }) {\n            addedLabelEvent {\n                ...AddedLabelEventTimelineInfo\n            }\n        }\n    }\n":
        types.AddLabelToIssueDocument,
    "\n    mutation removeLabelFromIssue($issue: ID!, $label: ID!) {\n        removeLabelFromIssue(input: { issue: $issue, label: $label }) {\n            removedLabelEvent {\n                ...RemovedLabelEventTimelineInfo\n            }\n        }\n    }\n":
        types.RemoveLabelFromIssueDocument,
    "\n    mutation removeAssignment($id: ID!) {\n        removeAssignment(input: { assignment: $id }) {\n            removedAssignmentEvent {\n                ...RemovedAssignmentEventTimelineInfo\n            }\n        }\n    }\n":
        types.RemoveAssignmentDocument,
    "\n    mutation changeAssignmentType($assignment: ID!, $type: ID) {\n        changeAssignmentType(input: { assignment: $assignment, type: $type }) {\n            assignmentTypeChangedEvent {\n                ...AssignmentTypeChangedEventTimelineInfo\n            }\n        }\n    }\n":
        types.ChangeAssignmentTypeDocument,
    "\n    mutation createAssignment($issue: ID!, $user: ID!) {\n        createAssignment(input: { issue: $issue, user: $user }) {\n            assignment {\n                ...AssignmentTimelineInfo\n            }\n        }\n    }\n":
        types.CreateAssignmentDocument,
    "\n    mutation removeIssueRelation($id: ID!) {\n        removeIssueRelation(input: { issueRelation: $id }) {\n            removedOutgoingRelationEvent {\n                ...RemovedOutgoingRelationEventTimelineInfo\n            }\n        }\n    }\n":
        types.RemoveIssueRelationDocument,
    "\n    mutation changeIssueRelationType($issueRelation: ID!, $type: ID) {\n        changeIssueRelationType(input: { issueRelation: $issueRelation, type: $type }) {\n            outgoingRelationTypeChangedEvent {\n                ...OutgoingRelationTypeChangedEventTimelineInfo\n            }\n        }\n    }\n":
        types.ChangeIssueRelationTypeDocument,
    "\n    mutation createIssueRelation($issue: ID!, $relatedIssue: ID!) {\n        createIssueRelation(input: { issue: $issue, relatedIssue: $relatedIssue }) {\n            issueRelation {\n                ...IssueRelationTimelineInfo\n            }\n        }\n    }\n":
        types.CreateIssueRelationDocument,
    "\n    mutation changeIssueTitle($id: ID!, $title: String!) {\n        changeIssueTitle(input: { issue: $id, title: $title }) {\n            titleChangedEvent {\n                ...TitleChangedEventTimelineInfo\n            }\n        }\n    }\n":
        types.ChangeIssueTitleDocument,
    "\n    mutation addAffectedEntityToIssue($issue: ID!, $affectedEntity: ID!) {\n        addAffectedEntityToIssue(input: { issue: $issue, affectedEntity: $affectedEntity }) {\n            addedAffectedEntityEvent {\n                ...AddedAffectedEntityEventTimelineInfo\n            }\n        }\n    }\n":
        types.AddAffectedEntityToIssueDocument,
    "\n    mutation removeAffectedEntityFromIssue($issue: ID!, $affectedEntity: ID!) {\n        removeAffectedEntityFromIssue(input: { issue: $issue, affectedEntity: $affectedEntity }) {\n            removedAffectedEntityEvent {\n                ...RemovedAffectedEntityEventTimelineInfo\n            }\n        }\n    }\n":
        types.RemoveAffectedEntityFromIssueDocument,
    "\n    mutation changeIssueTemplatedField($input: ChangeIssueTemplatedFieldInput!) {\n        changeIssueTemplatedField(input: $input) {\n            templatedFieldChangedEvent {\n                ...TemplatedFieldChangedEventTimelineInfo\n            }\n        }\n    }\n":
        types.ChangeIssueTemplatedFieldDocument,
    "\n    mutation addIssueToTrackable($issue: ID!, $trackable: ID!) {\n        addIssueToTrackable(input: { issue: $issue, trackable: $trackable }) {\n            addedToTrackableEvent {\n                ...AddedToTrackableEventTimelineInfo\n            }\n        }\n    }\n":
        types.AddIssueToTrackableDocument,
    "\n    mutation removeIssueFromTrackable($issue: ID!, $trackable: ID!) {\n        removeIssueFromTrackable(input: { issue: $issue, trackable: $trackable }) {\n            removedFromTrackableEvent {\n                ...RemovedFromTrackableEventTimelineInfo\n            }\n        }\n    }\n":
        types.RemoveIssueFromTrackableDocument,
    "\n    query getIssueList(\n        $orderBy: [IssueOrder!]!\n        $count: Int!\n        $skip: Int!\n        $filter: IssueFilterInput\n        $trackable: ID!\n    ) {\n        node(id: $trackable) {\n            __typename\n            ... on Trackable {\n                issues(filter: $filter, orderBy: $orderBy, first: $count, skip: $skip) {\n                    nodes {\n                        ...IssueListItemInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n":
        types.GetIssueListDocument,
    "\n    query getFilteredIssueList($query: String!, $count: Int!, $filter: IssueFilterInput) {\n        searchIssues(query: $query, first: $count, filter: $filter) {\n            ...IssueListItemInfo\n        }\n    }\n":
        types.GetFilteredIssueListDocument,
    "\n    query getComponentIssueList(\n        $orderBy: [IssueOrder!]!\n        $count: Int!\n        $skip: Int!\n        $filter: IssueFilterInput\n        $project: ID!\n    ) {\n        node(id: $project) {\n            __typename\n            ... on Project {\n                componentIssues(filter: $filter, orderBy: $orderBy, first: $count, skip: $skip) {\n                    nodes {\n                        ...ProjectComponentIssueListItemInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n":
        types.GetComponentIssueListDocument,
    "\n    query getComponentFilteredIssueList($query: String!, $count: Int!, $project: ID!, $filter: IssueFilterInput!) {\n        searchIssues(\n            query: $query\n            first: $count\n            filter: {\n                and: [$filter]\n                trackables: { any: { isComponentAnd: { versions: { any: { partOfProject: $project } } } } }\n            }\n        ) {\n            ...ProjectComponentIssueListItemInfo\n        }\n    }\n":
        types.GetComponentFilteredIssueListDocument,
    "\n    query getView($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on View {\n                name\n                filterByTemplate {\n                    nodes {\n                        id\n                    }\n                }\n                relationLayouts {\n                    nodes {\n                        relation {\n                            id\n                        }\n                        points {\n                            x\n                            y\n                        }\n                    }\n                }\n                relationPartnerLayouts {\n                    nodes {\n                        relationPartner {\n                            id\n                        }\n                        pos {\n                            x\n                            y\n                        }\n                    }\n                }\n            }\n        }\n    }\n":
        types.GetViewDocument,
    "\n    mutation addComponentVersionToProject($project: ID!, $componentVersion: ID!) {\n        addComponentVersionToProject(input: { componentVersion: $componentVersion, project: $project }) {\n            componentVersion {\n                component {\n                    template {\n                        id\n                    }\n                }\n            }\n        }\n    }\n":
        types.AddComponentVersionToProjectDocument,
    "\n    mutation removeComponentVersionFromProject($project: ID!, $componentVersion: ID!) {\n        removeComponentVersionFromProject(input: { componentVersion: $componentVersion, project: $project }) {\n            project {\n                id\n            }\n        }\n    }\n":
        types.RemoveComponentVersionFromProjectDocument,
    "\n    mutation createRelation($start: ID!, $end: ID!, $template: ID!) {\n        createRelation(input: { start: $start, end: $end, template: $template, templatedFields: [] }) {\n            relation {\n                id\n            }\n        }\n    }\n":
        types.CreateRelationDocument,
    "\n    mutation deleteRelation($id: ID!) {\n        deleteRelation(input: { id: $id }) {\n            id\n        }\n    }\n":
        types.DeleteRelationDocument,
    "\n    mutation updateView($input: UpdateViewInput!) {\n        updateView(input: $input) {\n            __typename\n        }\n    }\n":
        types.UpdateViewDocument,
    "\n    mutation updateProject($input: UpdateProjectInput!) {\n        updateProject(input: $input) {\n            project {\n                id\n            }\n        }\n    }\n":
        types.UpdateProjectDocument,
    "\n    query getProjectGraph($project: ID!) {\n        node(id: $project) {\n            __typename\n            ... on Project {\n                ...GraphInfo\n                relationLayouts {\n                    nodes {\n                        relation {\n                            id\n                        }\n                        points {\n                            x\n                            y\n                        }\n                    }\n                }\n                relationPartnerLayouts {\n                    nodes {\n                        relationPartner {\n                            id\n                        }\n                        pos {\n                            x\n                            y\n                        }\n                    }\n                }\n            }\n        }\n    }\n":
        types.GetProjectGraphDocument,
    "\n    query getProject($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on Project {\n                __typename\n                name\n                description\n                ...OpenIssueCount\n                createIssues: hasPermission(permission: CREATE_ISSUES)\n                manageLabels: hasPermission(permission: MANAGE_LABELS)\n                manageComponents: hasPermission(permission: MANAGE_COMPONENTS)\n                manageIssues: hasPermission(permission: MANAGE_ISSUES)\n                manageIMS: hasPermission(permission: MANAGE_IMS)\n                manageViews: hasPermission(permission: MANAGE_VIEWS)\n                admin: hasPermission(permission: ADMIN)\n            }\n        }\n    }\n":
        types.GetProjectDocument,
    "\n    mutation deleteProject($id: ID!) {\n        deleteProject(input: { id: $id }) {\n            __typename\n        }\n    }\n":
        types.DeleteProjectDocument,
    "\n    query getProjectGeneralDetails($id: ID!) {\n        node(id: $id) {\n            id\n            ... on Project {\n                name\n                description\n                repositoryURL\n                defaultView {\n                    id\n                }\n                admin: hasPermission(permission: ADMIN)\n            }\n        }\n    }\n":
        types.GetProjectGeneralDetailsDocument,
    "\n    query getProjectPermissionList(\n        $orderBy: [ProjectPermissionOrder!]!\n        $count: Int!\n        $skip: Int!\n        $project: ID!\n        $filter: ProjectPermissionFilterInput!\n    ) {\n        node(id: $project) {\n            ... on Project {\n                permissions(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n                    nodes {\n                        ...DefaultProjectPermissionInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n":
        types.GetProjectPermissionListDocument,
    "\n    query getFilteredProjectPermissionList($query: String!, $count: Int!, $filter: ProjectPermissionFilterInput!) {\n        searchProjectPermissions(query: $query, first: $count, filter: $filter) {\n            ...DefaultProjectPermissionInfo\n        }\n    }\n":
        types.GetFilteredProjectPermissionListDocument,
    "\n    mutation removeProjectPermissionFromProject($project: ID!, $projectPermission: ID!) {\n        updateProject(input: { id: $project, removedPermissions: [$projectPermission] }) {\n            __typename\n        }\n    }\n":
        types.RemoveProjectPermissionFromProjectDocument,
    "\n    mutation updateProjectPermission($input: UpdateProjectPermissionInput!) {\n        updateProjectPermission(input: $input) {\n            __typename\n        }\n    }\n":
        types.UpdateProjectPermissionDocument,
    "\n    mutation createProjectPermission($input: CreateProjectPermissionInput!) {\n        createProjectPermission(input: $input) {\n            projectPermission {\n                id\n            }\n        }\n    }\n":
        types.CreateProjectPermissionDocument,
    "\n    query getViewList($orderBy: [ViewOrder!]!, $count: Int!, $skip: Int!, $project: ID!, $filter: ViewFilterInput!) {\n        node(id: $project) {\n            ... on Project {\n                views(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n                    nodes {\n                        ...DefaultViewInfo\n                        filterByTemplate {\n                            nodes {\n                                description\n                            }\n                        }\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n":
        types.GetViewListDocument,
    "\n    query getFilteredViewList($query: String!, $count: Int!, $filter: ViewFilterInput!) {\n        searchViews(query: $query, first: $count, filter: $filter) {\n            ...DefaultViewInfo\n            filterByTemplate {\n                nodes {\n                    description\n                }\n            }\n        }\n    }\n":
        types.GetFilteredViewListDocument,
    "\n    query searchComponentTemplatesForViews($query: String!, $count: Int!) {\n        searchComponentTemplates(query: $query, first: $count) {\n            id\n            name\n            description\n        }\n    }\n":
        types.SearchComponentTemplatesForViewsDocument,
    "\n    query getProjectComponentTemplates($project: ID!) {\n        node(id: $project) {\n            ... on Project {\n                components {\n                    nodes {\n                        component {\n                            template {\n                                name\n                                id\n                            }\n                        }\n                    }\n                }\n            }\n        }\n    }\n":
        types.GetProjectComponentTemplatesDocument,
    "\n    mutation deleteView($id: ID!) {\n        deleteView(input: { id: $id }) {\n            __typename\n        }\n    }\n":
        types.DeleteViewDocument,
    "\n    query getIMSProjectListFromTrackable(\n        $orderBy: [IMSProjectOrder!]!\n        $count: Int!\n        $skip: Int!\n        $trackable: ID!\n        $filter: IMSProjectFilterInput!\n    ) {\n        node(id: $trackable) {\n            __typename\n            ... on Trackable {\n                syncsTo(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n                    nodes {\n                        ...DefaultIMSProjectInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n":
        types.GetImsProjectListFromTrackableDocument,
    "\n    query getLabelList($orderBy: [LabelOrder!]!, $count: Int!, $skip: Int!, $trackable: ID!) {\n        node(id: $trackable) {\n            __typename\n            ... on Trackable {\n                labels(orderBy: $orderBy, first: $count, skip: $skip) {\n                    nodes {\n                        ...DefaultLabelInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n":
        types.GetLabelListDocument,
    "\n    query getFilteredLabelList($query: String!, $count: Int!, $trackable: ID!) {\n        searchLabels(query: $query, first: $count, filter: { trackables: { any: { id: { eq: $trackable } } } }) {\n            ...DefaultLabelInfo\n        }\n    }\n":
        types.GetFilteredLabelListDocument,
    "\n    mutation removeLabelFromTrackable($trackable: ID!, $label: ID!) {\n        removeLabelFromTrackable(input: { label: $label, trackable: $trackable }) {\n            __typename\n        }\n    }\n":
        types.RemoveLabelFromTrackableDocument
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchGropiusUsersForPermissionList($query: String!, $count: Int!) {\n        searchGropiusUsers(query: $query, first: $count) {\n            id\n            username\n        }\n    }\n"
): (typeof documents)["\n    query searchGropiusUsersForPermissionList($query: String!, $count: Int!) {\n        searchGropiusUsers(query: $query, first: $count) {\n            id\n            username\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getIssueListForProjectSidebar(\n        $orderBy: [IssueOrder!]!\n        $count: Int!\n        $skip: Int!\n        $filter: IssueFilterInput\n        $trackable: ID!\n    ) {\n        node(id: $trackable) {\n            __typename\n            ... on Trackable {\n                issues(filter: $filter, orderBy: $orderBy, first: $count, skip: $skip) {\n                    nodes {\n                        ...IssueListItemInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getIssueListForProjectSidebar(\n        $orderBy: [IssueOrder!]!\n        $count: Int!\n        $skip: Int!\n        $filter: IssueFilterInput\n        $trackable: ID!\n    ) {\n        node(id: $trackable) {\n            __typename\n            ... on Trackable {\n                issues(filter: $filter, orderBy: $orderBy, first: $count, skip: $skip) {\n                    nodes {\n                        ...IssueListItemInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getIssueListOnAggregatedIssue(\n        $orderBy: [IssueOrder!]!\n        $count: Int!\n        $skip: Int!\n        $filter: IssueFilterInput\n        $aggregatedIssue: ID!\n    ) {\n        node(id: $aggregatedIssue) {\n            ... on AggregatedIssue {\n                issues(filter: $filter, orderBy: $orderBy, first: $count, skip: $skip) {\n                    nodes {\n                        ...IssueListItemInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getIssueListOnAggregatedIssue(\n        $orderBy: [IssueOrder!]!\n        $count: Int!\n        $skip: Int!\n        $filter: IssueFilterInput\n        $aggregatedIssue: ID!\n    ) {\n        node(id: $aggregatedIssue) {\n            ... on AggregatedIssue {\n                issues(filter: $filter, orderBy: $orderBy, first: $count, skip: $skip) {\n                    nodes {\n                        ...IssueListItemInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getFilteredIssueListForProjectSidebar($query: String!, $count: Int!, $filter: IssueFilterInput) {\n        searchIssues(query: $query, first: $count, filter: $filter) {\n            ...IssueListItemInfo\n        }\n    }\n"
): (typeof documents)["\n    query getFilteredIssueListForProjectSidebar($query: String!, $count: Int!, $filter: IssueFilterInput) {\n        searchIssues(query: $query, first: $count, filter: $filter) {\n            ...IssueListItemInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getInterfaceSpecificationVisibilityInfo($id: ID!, $componentTemplate: ID!) {\n        node(id: $id) {\n            ... on InterfaceSpecification {\n                template {\n                    canBeVisibleOnComponents(filter: { id: { eq: $componentTemplate } }) {\n                        totalCount\n                    }\n                    canBeInvisibleOnComponents(filter: { id: { eq: $componentTemplate } }) {\n                        totalCount\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getInterfaceSpecificationVisibilityInfo($id: ID!, $componentTemplate: ID!) {\n        node(id: $id) {\n            ... on InterfaceSpecification {\n                template {\n                    canBeVisibleOnComponents(filter: { id: { eq: $componentTemplate } }) {\n                        totalCount\n                    }\n                    canBeInvisibleOnComponents(filter: { id: { eq: $componentTemplate } }) {\n                        totalCount\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation addInterfaceSpecificationVersionToComponentVersion(\n        $input: AddInterfaceSpecificationVersionToComponentVersionInput!\n    ) {\n        addInterfaceSpecificationVersionToComponentVersion(input: $input) {\n            __typename\n        }\n    }\n"
): (typeof documents)["\n    mutation addInterfaceSpecificationVersionToComponentVersion(\n        $input: AddInterfaceSpecificationVersionToComponentVersionInput!\n    ) {\n        addInterfaceSpecificationVersionToComponentVersion(input: $input) {\n            __typename\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getComponentTemplateForDialog($id: ID!) {\n        node(id: $id) {\n            id\n            ... on ComponentTemplate {\n                templateFieldSpecifications {\n                    name\n                    value\n                }\n                componentVersionTemplate {\n                    templateFieldSpecifications {\n                        name\n                        value\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getComponentTemplateForDialog($id: ID!) {\n        node(id: $id) {\n            id\n            ... on ComponentTemplate {\n                templateFieldSpecifications {\n                    name\n                    value\n                }\n                componentVersionTemplate {\n                    templateFieldSpecifications {\n                        name\n                        value\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation createComponentFromDialog($input: CreateComponentInput!) {\n        createComponent(input: $input) {\n            component {\n                id\n                versions {\n                    nodes {\n                        id\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation createComponentFromDialog($input: CreateComponentInput!) {\n        createComponent(input: $input) {\n            component {\n                id\n                versions {\n                    nodes {\n                        id\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getComponentVersionTemplateForDialog($component: ID!) {\n        node(id: $component) {\n            id\n            ... on Component {\n                template {\n                    componentVersionTemplate {\n                        id\n                        templateFieldSpecifications {\n                            name\n                            value\n                        }\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getComponentVersionTemplateForDialog($component: ID!) {\n        node(id: $component) {\n            id\n            ... on Component {\n                template {\n                    componentVersionTemplate {\n                        id\n                        templateFieldSpecifications {\n                            name\n                            value\n                        }\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation createComponentVersion($input: CreateComponentVersionInput!) {\n        createComponentVersion(input: $input) {\n            componentVersion {\n                id\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation createComponentVersion($input: CreateComponentVersionInput!) {\n        createComponentVersion(input: $input) {\n            componentVersion {\n                id\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getIMSTemplateForDialog($id: ID!) {\n        node(id: $id) {\n            id\n            ... on IMSTemplate {\n                templateFieldSpecifications {\n                    name\n                    value\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getIMSTemplateForDialog($id: ID!) {\n        node(id: $id) {\n            id\n            ... on IMSTemplate {\n                templateFieldSpecifications {\n                    name\n                    value\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation createIMS($input: CreateIMSInput!) {\n        createIMS(input: $input) {\n            ims {\n                id\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation createIMS($input: CreateIMSInput!) {\n        createIMS(input: $input) {\n            ims {\n                id\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getIMSProjectTemplateForDialog($id: ID!) {\n        node(id: $id) {\n            id\n            ... on IMS {\n                template {\n                    imsProjectTemplate {\n                        id\n                        templateFieldSpecifications {\n                            name\n                            value\n                        }\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getIMSProjectTemplateForDialog($id: ID!) {\n        node(id: $id) {\n            id\n            ... on IMS {\n                template {\n                    imsProjectTemplate {\n                        id\n                        templateFieldSpecifications {\n                            name\n                            value\n                        }\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation createIMSProject($input: CreateIMSProjectInput!) {\n        createIMSProject(input: $input) {\n            imsProject {\n                id\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation createIMSProject($input: CreateIMSProjectInput!) {\n        createIMSProject(input: $input) {\n            imsProject {\n                id\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getInterfaceSpecificationTemplateForDialog($id: ID!) {\n        node(id: $id) {\n            id\n            ... on InterfaceSpecificationTemplate {\n                templateFieldSpecifications {\n                    name\n                    value\n                }\n                interfaceSpecificationVersionTemplate {\n                    templateFieldSpecifications {\n                        name\n                        value\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getInterfaceSpecificationTemplateForDialog($id: ID!) {\n        node(id: $id) {\n            id\n            ... on InterfaceSpecificationTemplate {\n                templateFieldSpecifications {\n                    name\n                    value\n                }\n                interfaceSpecificationVersionTemplate {\n                    templateFieldSpecifications {\n                        name\n                        value\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation createInterfaceSpecificationFromDialog($input: CreateInterfaceSpecificationInput!) {\n        createInterfaceSpecification(input: $input) {\n            interfaceSpecification {\n                id\n                versions {\n                    nodes {\n                        id\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation createInterfaceSpecificationFromDialog($input: CreateInterfaceSpecificationInput!) {\n        createInterfaceSpecification(input: $input) {\n            interfaceSpecification {\n                id\n                versions {\n                    nodes {\n                        id\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getInterfaceSpecificationVersionTemplateForDialog($interfaceSpecification: ID!) {\n        node(id: $interfaceSpecification) {\n            id\n            ... on InterfaceSpecification {\n                template {\n                    interfaceSpecificationVersionTemplate {\n                        id\n                        templateFieldSpecifications {\n                            name\n                            value\n                        }\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getInterfaceSpecificationVersionTemplateForDialog($interfaceSpecification: ID!) {\n        node(id: $interfaceSpecification) {\n            id\n            ... on InterfaceSpecification {\n                template {\n                    interfaceSpecificationVersionTemplate {\n                        id\n                        templateFieldSpecifications {\n                            name\n                            value\n                        }\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation createInterfaceSpecificationVersion($input: CreateInterfaceSpecificationVersionInput!) {\n        createInterfaceSpecificationVersion(input: $input) {\n            interfaceSpecificationVersion {\n                id\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation createInterfaceSpecificationVersion($input: CreateInterfaceSpecificationVersionInput!) {\n        createInterfaceSpecificationVersion(input: $input) {\n            interfaceSpecificationVersion {\n                id\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getIssueTemplateForDialog($id: ID!) {\n        node(id: $id) {\n            id\n            ... on IssueTemplate {\n                templateFieldSpecifications {\n                    name\n                    value\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getIssueTemplateForDialog($id: ID!) {\n        node(id: $id) {\n            id\n            ... on IssueTemplate {\n                templateFieldSpecifications {\n                    name\n                    value\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation createIssueFromDialog($input: CreateIssueInput!) {\n        createIssue(input: $input) {\n            issue {\n                id\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation createIssueFromDialog($input: CreateIssueInput!) {\n        createIssue(input: $input) {\n            issue {\n                id\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchIssueTemplatesByName($query: String!, $count: Int!) {\n        searchIssueTemplates(query: $query, first: $count, filter: { isDeprecated: { eq: false } }) {\n            id\n            name\n        }\n    }\n"
): (typeof documents)["\n    query searchIssueTemplatesByName($query: String!, $count: Int!) {\n        searchIssueTemplates(query: $query, first: $count, filter: { isDeprecated: { eq: false } }) {\n            id\n            name\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getIssueTemplateFields($id: ID!) {\n        node(id: $id) {\n            __typename\n            ... on IssueTemplate {\n                ...IssueTemplateFields\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getIssueTemplateFields($id: ID!) {\n        node(id: $id) {\n            __typename\n            ... on IssueTemplate {\n                ...IssueTemplateFields\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getIssueTemplateName($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on IssueTemplate {\n                name\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getIssueTemplateName($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on IssueTemplate {\n                name\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation createIssueTemplate($input: CreateIssueTemplateInput!) {\n        createIssueTemplate(input: $input) {\n            issueTemplate {\n                ...DefaultIssueTemplateInfo\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation createIssueTemplate($input: CreateIssueTemplateInput!) {\n        createIssueTemplate(input: $input) {\n            issueTemplate {\n                ...DefaultIssueTemplateInfo\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation createLabel($input: CreateLabelInput!) {\n        createLabel(input: $input) {\n            label {\n                ...DefaultLabelInfo\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation createLabel($input: CreateLabelInput!) {\n        createLabel(input: $input) {\n            label {\n                ...DefaultLabelInfo\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation createLegalInformation($input: CreateLegalInformationInput!) {\n        createLegalInformation(input: $input) {\n            legalInformation {\n                ...DefaultLegalInformationInfo\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation createLegalInformation($input: CreateLegalInformationInput!) {\n        createLegalInformation(input: $input) {\n            legalInformation {\n                ...DefaultLegalInformationInfo\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation createProject($input: CreateProjectInput!) {\n        createProject(input: $input) {\n            project {\n                id\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation createProject($input: CreateProjectInput!) {\n        createProject(input: $input) {\n            project {\n                id\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation createView($input: CreateViewInput!) {\n        createView(input: $input) {\n            view {\n                id\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation createView($input: CreateViewInput!) {\n        createView(input: $input) {\n            view {\n                id\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation addComponentPermissionToComponent($component: ID!, $componentPermission: ID!) {\n        updateComponent(input: { id: $component, addedPermissions: [$componentPermission] }) {\n            __typename\n        }\n    }\n"
): (typeof documents)["\n    mutation addComponentPermissionToComponent($component: ID!, $componentPermission: ID!) {\n        updateComponent(input: { id: $component, addedPermissions: [$componentPermission] }) {\n            __typename\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation addIMSPermissionToIMS($ims: ID!, $imsPermission: ID!) {\n        updateIMS(input: { id: $ims, addedPermissions: [$imsPermission] }) {\n            __typename\n        }\n    }\n"
): (typeof documents)["\n    mutation addIMSPermissionToIMS($ims: ID!, $imsPermission: ID!) {\n        updateIMS(input: { id: $ims, addedPermissions: [$imsPermission] }) {\n            __typename\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation addIssueToTrackableForImport($issue: ID!, $trackable: ID!) {\n        addIssueToTrackable(input: { issue: $issue, trackable: $trackable }) {\n            __typename\n        }\n    }\n"
): (typeof documents)["\n    mutation addIssueToTrackableForImport($issue: ID!, $trackable: ID!) {\n        addIssueToTrackable(input: { issue: $issue, trackable: $trackable }) {\n            __typename\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation addLabelToTrackable($trackable: ID!, $label: ID!) {\n        addLabelToTrackable(input: { label: $label, trackable: $trackable }) {\n            __typename\n        }\n    }\n"
): (typeof documents)["\n    mutation addLabelToTrackable($trackable: ID!, $label: ID!) {\n        addLabelToTrackable(input: { label: $label, trackable: $trackable }) {\n            __typename\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation addProjectPermissionToProject($project: ID!, $projectPermission: ID!) {\n        updateProject(input: { id: $project, addedPermissions: [$projectPermission] }) {\n            __typename\n        }\n    }\n"
): (typeof documents)["\n    mutation addProjectPermissionToProject($project: ID!, $projectPermission: ID!) {\n        updateProject(input: { id: $project, addedPermissions: [$projectPermission] }) {\n            __typename\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getPermissionUserList($orderBy: [GropiusUserOrder!]!, $count: Int!, $skip: Int!, $permission: ID!) {\n        node(id: $permission) {\n            ... on BasePermission {\n                users(orderBy: $orderBy, first: $count, skip: $skip) {\n                    nodes {\n                        ...DefaultUserInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getPermissionUserList($orderBy: [GropiusUserOrder!]!, $count: Int!, $skip: Int!, $permission: ID!) {\n        node(id: $permission) {\n            ... on BasePermission {\n                users(orderBy: $orderBy, first: $count, skip: $skip) {\n                    nodes {\n                        ...DefaultUserInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getFilteredPermissionUserList($query: String!, $count: Int!, $permission: ID!) {\n        searchGropiusUsers(\n            query: $query\n            first: $count\n            filter: { permissions: { any: { id: { eq: $permission } } } }\n        ) {\n            ...DefaultUserInfo\n        }\n    }\n"
): (typeof documents)["\n    query getFilteredPermissionUserList($query: String!, $count: Int!, $permission: ID!) {\n        searchGropiusUsers(\n            query: $query\n            first: $count\n            filter: { permissions: { any: { id: { eq: $permission } } } }\n        ) {\n            ...DefaultUserInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation updateLabel($input: UpdateLabelInput!) {\n        updateLabel(input: $input) {\n            label {\n                id\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation updateLabel($input: UpdateLabelInput!) {\n        updateLabel(input: $input) {\n            label {\n                id\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation updateLegalInformationForDialog($input: UpdateLegalInformationInput!) {\n        updateLegalInformation(input: $input) {\n            legalInformation {\n                id\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation updateLegalInformationForDialog($input: UpdateLegalInformationInput!) {\n        updateLegalInformation(input: $input) {\n            legalInformation {\n                id\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation updateIssueType($input: UpdateIssueTypeInput!) {\n        updateIssueType(input: $input) {\n            issueType {\n                id\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation updateIssueType($input: UpdateIssueTypeInput!) {\n        updateIssueType(input: $input) {\n            issueType {\n                id\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation updateIssuePriority($input: UpdateIssuePriorityInput!) {\n        updateIssuePriority(input: $input) {\n            issuePriority {\n                id\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation updateIssuePriority($input: UpdateIssuePriorityInput!) {\n        updateIssuePriority(input: $input) {\n            issuePriority {\n                id\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation updateIssueState($input: UpdateIssueStateInput!) {\n        updateIssueState(input: $input) {\n            issueState {\n                id\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation updateIssueState($input: UpdateIssueStateInput!) {\n        updateIssueState(input: $input) {\n            issueState {\n                id\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation updateAssignmentType($input: UpdateAssignmentTypeInput!) {\n        updateAssignmentType(input: $input) {\n            assignmentType {\n                id\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation updateAssignmentType($input: UpdateAssignmentTypeInput!) {\n        updateAssignmentType(input: $input) {\n            assignmentType {\n                id\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation updateIssueRelationType($input: UpdateIssueRelationTypeInput!) {\n        updateIssueRelationType(input: $input) {\n            issueRelationType {\n                id\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation updateIssueRelationType($input: UpdateIssueRelationTypeInput!) {\n        updateIssueRelationType(input: $input) {\n            issueRelationType {\n                id\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation updateViewForDialog($input: UpdateViewInput!) {\n        updateView(input: $input) {\n            view {\n                id\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation updateViewForDialog($input: UpdateViewInput!) {\n        updateView(input: $input) {\n            view {\n                id\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchAffectedByIssuesForAutocomplete($query: String!, $count: Int!, $trackable: ID!, $sublistCount: Int) {\n        searchAffectedByIssues(query: $query, first: $count, filter: { relatedTo: $trackable }) {\n            ...DetailedAffectedByIssueInfo\n        }\n    }\n"
): (typeof documents)["\n    query searchAffectedByIssuesForAutocomplete($query: String!, $count: Int!, $trackable: ID!, $sublistCount: Int) {\n        searchAffectedByIssues(query: $query, first: $count, filter: { relatedTo: $trackable }) {\n            ...DetailedAffectedByIssueInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query firstComponentVersionsForAutocomplete($component: ID!, $count: Int!) {\n        node(id: $component) {\n            ... on Component {\n                versions(first: $count) {\n                    nodes {\n                        ...DefaultComponentVersionInfo\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query firstComponentVersionsForAutocomplete($component: ID!, $count: Int!) {\n        node(id: $component) {\n            ... on Component {\n                versions(first: $count) {\n                    nodes {\n                        ...DefaultComponentVersionInfo\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchTrackablesForAutocomplete($query: String!, $count: Int!) {\n        searchTrackables(query: $query, first: $count) {\n            ...DefaultTrackableInfo\n        }\n    }\n"
): (typeof documents)["\n    query searchTrackablesForAutocomplete($query: String!, $count: Int!) {\n        searchTrackables(query: $query, first: $count) {\n            ...DefaultTrackableInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query firstTrackablesForAutocomplete($count: Int!) {\n        trackables(first: $count) {\n            nodes {\n                ...DefaultTrackableInfo\n            }\n        }\n    }\n"
): (typeof documents)["\n    query firstTrackablesForAutocomplete($count: Int!) {\n        trackables(first: $count) {\n            nodes {\n                ...DefaultTrackableInfo\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchAssignmentTypes($template: ID!, $query: String!, $count: Int!) {\n        searchAssignmentTypes(query: $query, first: $count, filter: { partOf: { any: { id: { eq: $template } } } }) {\n            ...DefaultAssignmentTypeInfo\n        }\n    }\n"
): (typeof documents)["\n    query searchAssignmentTypes($template: ID!, $query: String!, $count: Int!) {\n        searchAssignmentTypes(query: $query, first: $count, filter: { partOf: { any: { id: { eq: $template } } } }) {\n            ...DefaultAssignmentTypeInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query firstAssignmentTypes($template: ID!, $count: Int!) {\n        node(id: $template) {\n            ... on IssueTemplate {\n                assignmentTypes(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultAssignmentTypeInfo\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query firstAssignmentTypes($template: ID!, $count: Int!) {\n        node(id: $template) {\n            ... on IssueTemplate {\n                assignmentTypes(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultAssignmentTypeInfo\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchComponentTemplatesForAutocomplete($query: String!, $count: Int!) {\n        searchComponentTemplates(query: $query, first: $count, filter: { isDeprecated: { eq: false } }) {\n            ...DefaultComponentTemplateInfo\n        }\n    }\n"
): (typeof documents)["\n    query searchComponentTemplatesForAutocomplete($query: String!, $count: Int!) {\n        searchComponentTemplates(query: $query, first: $count, filter: { isDeprecated: { eq: false } }) {\n            ...DefaultComponentTemplateInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query firstComponentTemplatesForAutocomplete($count: Int!) {\n        componentTemplates(first: $count, orderBy: [{ field: NAME }], filter: { isDeprecated: { eq: false } }) {\n            nodes {\n                ...DefaultComponentTemplateInfo\n            }\n        }\n    }\n"
): (typeof documents)["\n    query firstComponentTemplatesForAutocomplete($count: Int!) {\n        componentTemplates(first: $count, orderBy: [{ field: NAME }], filter: { isDeprecated: { eq: false } }) {\n            nodes {\n                ...DefaultComponentTemplateInfo\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchComponentVersions($query: String!, $count: Int!, $component: ID!) {\n        searchComponentVersions(query: $query, first: $count, filter: { component: { id: { eq: $component } } }) {\n            ...DefaultComponentVersionInfo\n        }\n    }\n"
): (typeof documents)["\n    query searchComponentVersions($query: String!, $count: Int!, $component: ID!) {\n        searchComponentVersions(query: $query, first: $count, filter: { component: { id: { eq: $component } } }) {\n            ...DefaultComponentVersionInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query firstComponentVersions($component: ID!, $count: Int!) {\n        node(id: $component) {\n            id\n            ... on Component {\n                versions(first: $count) {\n                    nodes {\n                        ...DefaultComponentVersionInfo\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query firstComponentVersions($component: ID!, $count: Int!) {\n        node(id: $component) {\n            id\n            ... on Component {\n                versions(first: $count) {\n                    nodes {\n                        ...DefaultComponentVersionInfo\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchComponentsForVersionAutocomplete($query: String!, $count: Int!, $filter: ComponentFilterInput) {\n        searchComponents(query: $query, first: $count, filter: $filter) {\n            ...DefaultTrackableInfo\n        }\n    }\n"
): (typeof documents)["\n    query searchComponentsForVersionAutocomplete($query: String!, $count: Int!, $filter: ComponentFilterInput) {\n        searchComponents(query: $query, first: $count, filter: $filter) {\n            ...DefaultTrackableInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query firstComponentsForVersionAutocomplete($count: Int!, $filter: ComponentFilterInput) {\n        components(first: $count, filter: $filter) {\n            nodes {\n                ...DefaultTrackableInfo\n            }\n        }\n    }\n"
): (typeof documents)["\n    query firstComponentsForVersionAutocomplete($count: Int!, $filter: ComponentFilterInput) {\n        components(first: $count, filter: $filter) {\n            nodes {\n                ...DefaultTrackableInfo\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchComponentPermissionsForExternal($query: String!, $count: Int!, $component: ID!) {\n        searchComponentPermissions(\n            query: $query\n            first: $count\n            filter: { nodesWithPermission: { any: { id: { eq: $component } } } }\n        ) {\n            ...DefaultComponentPermissionInfo\n        }\n    }\n"
): (typeof documents)["\n    query searchComponentPermissionsForExternal($query: String!, $count: Int!, $component: ID!) {\n        searchComponentPermissions(\n            query: $query\n            first: $count\n            filter: { nodesWithPermission: { any: { id: { eq: $component } } } }\n        ) {\n            ...DefaultComponentPermissionInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query firstComponentPermissions($component: ID!, $count: Int!) {\n        node(id: $component) {\n            ... on Component {\n                permissions(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultComponentPermissionInfo\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query firstComponentPermissions($component: ID!, $count: Int!) {\n        node(id: $component) {\n            ... on Component {\n                permissions(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultComponentPermissionInfo\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchComponentsForPermissionAutocomplete($query: String!, $count: Int!) {\n        searchComponents(query: $query, first: $count) {\n            ...DefaultTrackableInfo\n        }\n    }\n"
): (typeof documents)["\n    query searchComponentsForPermissionAutocomplete($query: String!, $count: Int!) {\n        searchComponents(query: $query, first: $count) {\n            ...DefaultTrackableInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query firstComponentsForPermissionAutocomplete($count: Int!) {\n        components(first: $count) {\n            nodes {\n                ...DefaultTrackableInfo\n            }\n        }\n    }\n"
): (typeof documents)["\n    query firstComponentsForPermissionAutocomplete($count: Int!) {\n        components(first: $count) {\n            nodes {\n                ...DefaultTrackableInfo\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchIMSPermissionsForExternal($query: String!, $count: Int!, $ims: ID!) {\n        searchIMSPermissions(\n            query: $query\n            first: $count\n            filter: { nodesWithPermission: { any: { id: { eq: $ims } } } }\n        ) {\n            ...DefaultIMSPermissionInfo\n        }\n    }\n"
): (typeof documents)["\n    query searchIMSPermissionsForExternal($query: String!, $count: Int!, $ims: ID!) {\n        searchIMSPermissions(\n            query: $query\n            first: $count\n            filter: { nodesWithPermission: { any: { id: { eq: $ims } } } }\n        ) {\n            ...DefaultIMSPermissionInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query firstIMSPermissions($ims: ID!, $count: Int!) {\n        node(id: $ims) {\n            ... on IMS {\n                permissions(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultIMSPermissionInfo\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query firstIMSPermissions($ims: ID!, $count: Int!) {\n        node(id: $ims) {\n            ... on IMS {\n                permissions(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultIMSPermissionInfo\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchIMSsForExternal($query: String!, $count: Int!) {\n        searchIMSs(query: $query, first: $count) {\n            ...DefaultIMSInfo\n        }\n    }\n"
): (typeof documents)["\n    query searchIMSsForExternal($query: String!, $count: Int!) {\n        searchIMSs(query: $query, first: $count) {\n            ...DefaultIMSInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchIssuesForExternal($query: String!, $count: Int!, $trackable: ID!) {\n        searchIssues(query: $query, first: $count, filter: { trackables: { any: { id: { eq: $trackable } } } }) {\n            ...DefaultIssueInfo\n        }\n    }\n"
): (typeof documents)["\n    query searchIssuesForExternal($query: String!, $count: Int!, $trackable: ID!) {\n        searchIssues(query: $query, first: $count, filter: { trackables: { any: { id: { eq: $trackable } } } }) {\n            ...DefaultIssueInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query firstIssuesForExternalAutocomplete($trackable: ID!, $count: Int!) {\n        node(id: $trackable) {\n            ... on Component {\n                issues(first: $count, orderBy: [{ field: LAST_UPDATED_AT, direction: DESC }]) {\n                    nodes {\n                        ...DefaultIssueInfo\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query firstIssuesForExternalAutocomplete($trackable: ID!, $count: Int!) {\n        node(id: $trackable) {\n            ... on Component {\n                issues(first: $count, orderBy: [{ field: LAST_UPDATED_AT, direction: DESC }]) {\n                    nodes {\n                        ...DefaultIssueInfo\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchTrackablesForExternal($query: String!, $count: Int!) {\n        searchTrackables(query: $query, first: $count) {\n            ...DefaultTrackableInfo\n        }\n    }\n"
): (typeof documents)["\n    query searchTrackablesForExternal($query: String!, $count: Int!) {\n        searchTrackables(query: $query, first: $count) {\n            ...DefaultTrackableInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query firstTrackablesForExternal($count: Int!) {\n        trackables(first: $count) {\n            nodes {\n                ...DefaultTrackableInfo\n            }\n        }\n    }\n"
): (typeof documents)["\n    query firstTrackablesForExternal($count: Int!) {\n        trackables(first: $count) {\n            nodes {\n                ...DefaultTrackableInfo\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchTrackableLabels($trackable: ID!, $query: String!, $count: Int!) {\n        searchLabels(query: $query, first: $count, filter: { trackables: { any: { id: { eq: $trackable } } } }) {\n            ...DefaultLabelInfo\n        }\n    }\n"
): (typeof documents)["\n    query searchTrackableLabels($trackable: ID!, $query: String!, $count: Int!) {\n        searchLabels(query: $query, first: $count, filter: { trackables: { any: { id: { eq: $trackable } } } }) {\n            ...DefaultLabelInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query firstTrackableLabelsForExternal($trackable: ID!, $count: Int!) {\n        node(id: $trackable) {\n            ... on Trackable {\n                labels(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultLabelInfo\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query firstTrackableLabelsForExternal($trackable: ID!, $count: Int!) {\n        node(id: $trackable) {\n            ... on Trackable {\n                labels(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultLabelInfo\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchProjectPermissions($project: ID!, $query: String!, $count: Int!) {\n        searchProjectPermissions(\n            query: $query\n            first: $count\n            filter: { nodesWithPermission: { any: { id: { eq: $project } } } }\n        ) {\n            ...DefaultProjectPermissionInfo\n        }\n    }\n"
): (typeof documents)["\n    query searchProjectPermissions($project: ID!, $query: String!, $count: Int!) {\n        searchProjectPermissions(\n            query: $query\n            first: $count\n            filter: { nodesWithPermission: { any: { id: { eq: $project } } } }\n        ) {\n            ...DefaultProjectPermissionInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query firstProjectPermissions($project: ID!, $count: Int!) {\n        node(id: $project) {\n            ... on Project {\n                permissions(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultProjectPermissionInfo\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query firstProjectPermissions($project: ID!, $count: Int!) {\n        node(id: $project) {\n            ... on Project {\n                permissions(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultProjectPermissionInfo\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchProjectsForPermissionAutocomplete($query: String!, $count: Int!) {\n        searchProjects(query: $query, first: $count) {\n            ...DefaultTrackableInfo\n        }\n    }\n"
): (typeof documents)["\n    query searchProjectsForPermissionAutocomplete($query: String!, $count: Int!) {\n        searchProjects(query: $query, first: $count) {\n            ...DefaultTrackableInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query firstProjectsForPermissionAutocomplete($count: Int!) {\n        projects(first: $count) {\n            nodes {\n                ...DefaultTrackableInfo\n            }\n        }\n    }\n"
): (typeof documents)["\n    query firstProjectsForPermissionAutocomplete($count: Int!) {\n        projects(first: $count) {\n            nodes {\n                ...DefaultTrackableInfo\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchGropiusUsers($query: String!, $count: Int!, $filter: GropiusUserFilterInput) {\n        searchGropiusUsers(query: $query, first: $count, filter: $filter) {\n            ...DefaultUserInfo\n        }\n    }\n"
): (typeof documents)["\n    query searchGropiusUsers($query: String!, $count: Int!, $filter: GropiusUserFilterInput) {\n        searchGropiusUsers(query: $query, first: $count, filter: $filter) {\n            ...DefaultUserInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchIMSs($query: String!, $count: Int!, $filter: IMSFilterInput) {\n        searchIMSs(query: $query, first: $count, filter: $filter) {\n            ...DefaultIMSInfo\n        }\n    }\n"
): (typeof documents)["\n    query searchIMSs($query: String!, $count: Int!, $filter: IMSFilterInput) {\n        searchIMSs(query: $query, first: $count, filter: $filter) {\n            ...DefaultIMSInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query firstIMSs($count: Int!, $filter: IMSFilterInput) {\n        imss(first: $count, filter: $filter) {\n            nodes {\n                ...DefaultIMSInfo\n            }\n        }\n    }\n"
): (typeof documents)["\n    query firstIMSs($count: Int!, $filter: IMSFilterInput) {\n        imss(first: $count, filter: $filter) {\n            nodes {\n                ...DefaultIMSInfo\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchIMSTemplatesForAutocomplete($query: String!, $count: Int!) {\n        searchIMSTemplates(query: $query, first: $count, filter: { isDeprecated: { eq: false } }) {\n            ...DefaultIMSTemplateInfo\n        }\n    }\n"
): (typeof documents)["\n    query searchIMSTemplatesForAutocomplete($query: String!, $count: Int!) {\n        searchIMSTemplates(query: $query, first: $count, filter: { isDeprecated: { eq: false } }) {\n            ...DefaultIMSTemplateInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query firstIMSTemplatesForAutocomplete($count: Int!) {\n        imsTemplates(first: $count, orderBy: [{ field: NAME }], filter: { isDeprecated: { eq: false } }) {\n            nodes {\n                ...DefaultIMSTemplateInfo\n            }\n        }\n    }\n"
): (typeof documents)["\n    query firstIMSTemplatesForAutocomplete($count: Int!) {\n        imsTemplates(first: $count, orderBy: [{ field: NAME }], filter: { isDeprecated: { eq: false } }) {\n            nodes {\n                ...DefaultIMSTemplateInfo\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchInterfaceSpecifications($query: String!, $count: Int!, $component: ID!) {\n        searchInterfaceSpecifications(query: $query, first: $count, filter: { component: { id: { eq: $component } } }) {\n            ...DefaultInterfaceSpecificationInfo\n        }\n    }\n"
): (typeof documents)["\n    query searchInterfaceSpecifications($query: String!, $count: Int!, $component: ID!) {\n        searchInterfaceSpecifications(query: $query, first: $count, filter: { component: { id: { eq: $component } } }) {\n            ...DefaultInterfaceSpecificationInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query firstInterfaceSpecifications($count: Int!, $component: ID!) {\n        node(id: $component) {\n            ... on Component {\n                interfaceSpecifications(first: $count) {\n                    nodes {\n                        ...DefaultInterfaceSpecificationInfo\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query firstInterfaceSpecifications($count: Int!, $component: ID!) {\n        node(id: $component) {\n            ... on Component {\n                interfaceSpecifications(first: $count) {\n                    nodes {\n                        ...DefaultInterfaceSpecificationInfo\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchInterfaceSpecificationTemplates(\n        $query: String!\n        $count: Int!\n        $filter: InterfaceSpecificationTemplateFilterInput\n    ) {\n        searchInterfaceSpecificationTemplates(query: $query, first: $count, filter: $filter) {\n            ...DefaultInterfaceSpecificationTemplateInfo\n        }\n    }\n"
): (typeof documents)["\n    query searchInterfaceSpecificationTemplates(\n        $query: String!\n        $count: Int!\n        $filter: InterfaceSpecificationTemplateFilterInput\n    ) {\n        searchInterfaceSpecificationTemplates(query: $query, first: $count, filter: $filter) {\n            ...DefaultInterfaceSpecificationTemplateInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query firstInterfaceSpecificationTemplates($count: Int!, $filter: InterfaceSpecificationTemplateFilterInput) {\n        interfaceSpecificationTemplates(first: $count, orderBy: [{ field: NAME }], filter: $filter) {\n            nodes {\n                ...DefaultInterfaceSpecificationTemplateInfo\n            }\n        }\n    }\n"
): (typeof documents)["\n    query firstInterfaceSpecificationTemplates($count: Int!, $filter: InterfaceSpecificationTemplateFilterInput) {\n        interfaceSpecificationTemplates(first: $count, orderBy: [{ field: NAME }], filter: $filter) {\n            nodes {\n                ...DefaultInterfaceSpecificationTemplateInfo\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchInterfaceSpecificationVersionsForAutocomplete(\n        $query: String!\n        $count: Int!\n        $interfaceSpecification: ID!\n    ) {\n        searchInterfaceSpecificationVersions(\n            query: $query\n            first: $count\n            filter: { interfaceSpecification: { id: { eq: $interfaceSpecification } } }\n        ) {\n            ...DefaultInterfaceSpecificationVersionInfo\n        }\n    }\n"
): (typeof documents)["\n    query searchInterfaceSpecificationVersionsForAutocomplete(\n        $query: String!\n        $count: Int!\n        $interfaceSpecification: ID!\n    ) {\n        searchInterfaceSpecificationVersions(\n            query: $query\n            first: $count\n            filter: { interfaceSpecification: { id: { eq: $interfaceSpecification } } }\n        ) {\n            ...DefaultInterfaceSpecificationVersionInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query firstInterfaceSpecificationVersionsForAutocomplete($interfaceSpecification: ID!, $count: Int!) {\n        node(id: $interfaceSpecification) {\n            ... on InterfaceSpecification {\n                versions(first: $count) {\n                    nodes {\n                        ...DefaultInterfaceSpecificationVersionInfo\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query firstInterfaceSpecificationVersionsForAutocomplete($interfaceSpecification: ID!, $count: Int!) {\n        node(id: $interfaceSpecification) {\n            ... on InterfaceSpecification {\n                versions(first: $count) {\n                    nodes {\n                        ...DefaultInterfaceSpecificationVersionInfo\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchInterfaceSpecificationsForAutocomplete($query: String!, $count: Int!, $component: ID!) {\n        searchInterfaceSpecifications(query: $query, first: $count, filter: { component: { id: { eq: $component } } }) {\n            ...DefaultInterfaceSpecificationInfo\n        }\n    }\n"
): (typeof documents)["\n    query searchInterfaceSpecificationsForAutocomplete($query: String!, $count: Int!, $component: ID!) {\n        searchInterfaceSpecifications(query: $query, first: $count, filter: { component: { id: { eq: $component } } }) {\n            ...DefaultInterfaceSpecificationInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query firstInterfaceSpecificationsForAutocomplete($count: Int!, $component: ID!) {\n        node(id: $component) {\n            ... on Component {\n                interfaceSpecifications(first: $count) {\n                    nodes {\n                        ...DefaultInterfaceSpecificationInfo\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query firstInterfaceSpecificationsForAutocomplete($count: Int!, $component: ID!) {\n        node(id: $component) {\n            ... on Component {\n                interfaceSpecifications(first: $count) {\n                    nodes {\n                        ...DefaultInterfaceSpecificationInfo\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchInterfaceSpecificationVersionsForModel($query: String!, $count: Int!, $interfaceSpecification: ID!) {\n        searchInterfaceSpecificationVersions(\n            query: $query\n            first: $count\n            filter: { interfaceSpecification: { id: { eq: $interfaceSpecification } } }\n        ) {\n            ...DefaultInterfaceSpecificationVersionInfo\n        }\n    }\n"
): (typeof documents)["\n    query searchInterfaceSpecificationVersionsForModel($query: String!, $count: Int!, $interfaceSpecification: ID!) {\n        searchInterfaceSpecificationVersions(\n            query: $query\n            first: $count\n            filter: { interfaceSpecification: { id: { eq: $interfaceSpecification } } }\n        ) {\n            ...DefaultInterfaceSpecificationVersionInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query firstInterfaceSpecificationVersionsForModel($interfaceSpecification: ID!, $count: Int!) {\n        node(id: $interfaceSpecification) {\n            ... on InterfaceSpecification {\n                versions(first: $count) {\n                    nodes {\n                        ...DefaultInterfaceSpecificationVersionInfo\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query firstInterfaceSpecificationVersionsForModel($interfaceSpecification: ID!, $count: Int!) {\n        node(id: $interfaceSpecification) {\n            ... on InterfaceSpecification {\n                versions(first: $count) {\n                    nodes {\n                        ...DefaultInterfaceSpecificationVersionInfo\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getUsedIssueTemplates($trackable: ID!, $filter: String!) {\n        node(id: $trackable) {\n            ... on Trackable {\n                usedIssueTemplates(filter: { name: { contains: $filter } }) {\n                    nodes {\n                        ...DefaultIssueTemplateInfo\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getUsedIssueTemplates($trackable: ID!, $filter: String!) {\n        node(id: $trackable) {\n            ... on Trackable {\n                usedIssueTemplates(filter: { name: { contains: $filter } }) {\n                    nodes {\n                        ...DefaultIssueTemplateInfo\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getUsedLabels($trackable: ID!, $filter: String!) {\n        node(id: $trackable) {\n            ... on Trackable {\n                usedLabels(filter: { name: { contains: $filter } }) {\n                    nodes {\n                        ...DefaultLabelInfo\n                        trackables {\n                            nodes {\n                                id\n                                name\n                                description\n                            }\n                        }\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getUsedLabels($trackable: ID!, $filter: String!) {\n        node(id: $trackable) {\n            ... on Trackable {\n                usedLabels(filter: { name: { contains: $filter } }) {\n                    nodes {\n                        ...DefaultLabelInfo\n                        trackables {\n                            nodes {\n                                id\n                                name\n                                description\n                            }\n                        }\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query firstTrackableLabelsForFilter($trackable: ID!, $count: Int!) {\n        node(id: $trackable) {\n            ... on Trackable {\n                labels(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultLabelInfo\n                        trackables {\n                            nodes {\n                                id\n                                name\n                                description\n                            }\n                        }\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query firstTrackableLabelsForFilter($trackable: ID!, $count: Int!) {\n        node(id: $trackable) {\n            ... on Trackable {\n                labels(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultLabelInfo\n                        trackables {\n                            nodes {\n                                id\n                                name\n                                description\n                            }\n                        }\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getUsedIssuePriorities($trackable: ID!, $filter: String!) {\n        node(id: $trackable) {\n            ... on Trackable {\n                usedIssuePriorities(filter: { name: { contains: $filter } }) {\n                    nodes {\n                        ...DefaultIssuePriorityInfo\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getUsedIssuePriorities($trackable: ID!, $filter: String!) {\n        node(id: $trackable) {\n            ... on Trackable {\n                usedIssuePriorities(filter: { name: { contains: $filter } }) {\n                    nodes {\n                        ...DefaultIssuePriorityInfo\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getUsedIssueTypes($trackable: ID!, $filter: String!) {\n        node(id: $trackable) {\n            ... on Trackable {\n                usedIssueTypes(filter: { name: { contains: $filter } }) {\n                    nodes {\n                        ...DefaultIssueTypeInfo\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getUsedIssueTypes($trackable: ID!, $filter: String!) {\n        node(id: $trackable) {\n            ... on Trackable {\n                usedIssueTypes(filter: { name: { contains: $filter } }) {\n                    nodes {\n                        ...DefaultIssueTypeInfo\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getAssignedUsers($trackable: ID!, $filter: String!) {\n        node(id: $trackable) {\n            ... on Trackable {\n                assignedUsers(filter: { username: { contains: $filter } }) {\n                    nodes {\n                        ...DefaultUserInfo\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getAssignedUsers($trackable: ID!, $filter: String!) {\n        node(id: $trackable) {\n            ... on Trackable {\n                assignedUsers(filter: { username: { contains: $filter } }) {\n                    nodes {\n                        ...DefaultUserInfo\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getUsedIssueStates($trackable: ID!, $filter: String!) {\n        node(id: $trackable) {\n            ... on Trackable {\n                usedIssueStates(filter: { name: { contains: $filter } }) {\n                    nodes {\n                        ...DefaultIssueStateInfo\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getUsedIssueStates($trackable: ID!, $filter: String!) {\n        node(id: $trackable) {\n            ... on Trackable {\n                usedIssueStates(filter: { name: { contains: $filter } }) {\n                    nodes {\n                        ...DefaultIssueStateInfo\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query firstAffectedByIssuesForFilter($trackable: ID!, $count: Int!, $sublistCount: Int!) {\n        node(id: $trackable) {\n            ... on Trackable {\n                affectedEntities(first: $count) {\n                    nodes {\n                        ...DetailedAffectedByIssueInfo\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query firstAffectedByIssuesForFilter($trackable: ID!, $count: Int!, $sublistCount: Int!) {\n        node(id: $trackable) {\n            ... on Trackable {\n                affectedEntities(first: $count) {\n                    nodes {\n                        ...DetailedAffectedByIssueInfo\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchAffectedByIssuesForFilter($query: String!, $count: Int!, $trackable: ID!) {\n        searchAffectedByIssues(query: $query, first: $count, filter: { relatedTo: $trackable }) {\n            ...DefaultAffectedByIssueInfo\n            ... on Component {\n                versions(first: 100) {\n                    nodes {\n                        id\n                        version\n                    }\n                }\n            }\n            ... on InterfaceSpecification {\n                versions(first: 100) {\n                    nodes {\n                        id\n                        version\n                        interfaceDefinitions(\n                            first: 100\n                            filter: {\n                                visibleInterface: {}\n                                componentVersion: { component: { id: { eq: $trackable } } }\n                            }\n                        ) {\n                            nodes {\n                                visibleInterface {\n                                    id\n                                }\n                            }\n                        }\n                    }\n                }\n            }\n            ... on InterfaceSpecificationVersion {\n                interfaceDefinitions(\n                    first: 100\n                    filter: { visibleInterface: {}, componentVersion: { component: { id: { eq: $trackable } } } }\n                ) {\n                    nodes {\n                        visibleInterface {\n                            id\n                        }\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query searchAffectedByIssuesForFilter($query: String!, $count: Int!, $trackable: ID!) {\n        searchAffectedByIssues(query: $query, first: $count, filter: { relatedTo: $trackable }) {\n            ...DefaultAffectedByIssueInfo\n            ... on Component {\n                versions(first: 100) {\n                    nodes {\n                        id\n                        version\n                    }\n                }\n            }\n            ... on InterfaceSpecification {\n                versions(first: 100) {\n                    nodes {\n                        id\n                        version\n                        interfaceDefinitions(\n                            first: 100\n                            filter: {\n                                visibleInterface: {}\n                                componentVersion: { component: { id: { eq: $trackable } } }\n                            }\n                        ) {\n                            nodes {\n                                visibleInterface {\n                                    id\n                                }\n                            }\n                        }\n                    }\n                }\n            }\n            ... on InterfaceSpecificationVersion {\n                interfaceDefinitions(\n                    first: 100\n                    filter: { visibleInterface: {}, componentVersion: { component: { id: { eq: $trackable } } } }\n                ) {\n                    nodes {\n                        visibleInterface {\n                            id\n                        }\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchAffectedByIssuesWithoutTrackableForFilter($query: String!, $count: Int!) {\n        searchAffectedByIssues(query: $query, first: $count) {\n            ...DefaultAffectedByIssueInfo\n            ... on Component {\n                versions(first: 100) {\n                    nodes {\n                        id\n                        version\n                    }\n                }\n            }\n            ... on InterfaceSpecification {\n                versions(first: 100) {\n                    nodes {\n                        id\n                        version\n                        interfaceDefinitions(first: 100, filter: { visibleInterface: {} }) {\n                            nodes {\n                                visibleInterface {\n                                    id\n                                }\n                            }\n                        }\n                    }\n                }\n            }\n            ... on InterfaceSpecificationVersion {\n                interfaceDefinitions(first: 100, filter: { visibleInterface: {} }) {\n                    nodes {\n                        visibleInterface {\n                            id\n                        }\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query searchAffectedByIssuesWithoutTrackableForFilter($query: String!, $count: Int!) {\n        searchAffectedByIssues(query: $query, first: $count) {\n            ...DefaultAffectedByIssueInfo\n            ... on Component {\n                versions(first: 100) {\n                    nodes {\n                        id\n                        version\n                    }\n                }\n            }\n            ... on InterfaceSpecification {\n                versions(first: 100) {\n                    nodes {\n                        id\n                        version\n                        interfaceDefinitions(first: 100, filter: { visibleInterface: {} }) {\n                            nodes {\n                                visibleInterface {\n                                    id\n                                }\n                            }\n                        }\n                    }\n                }\n            }\n            ... on InterfaceSpecificationVersion {\n                interfaceDefinitions(first: 100, filter: { visibleInterface: {} }) {\n                    nodes {\n                        visibleInterface {\n                            id\n                        }\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchIssuePriorities($template: ID!, $query: String!, $count: Int!) {\n        searchIssuePriorities(query: $query, first: $count, filter: { partOf: { any: { id: { eq: $template } } } }) {\n            ...DefaultIssuePriorityInfo\n        }\n    }\n"
): (typeof documents)["\n    query searchIssuePriorities($template: ID!, $query: String!, $count: Int!) {\n        searchIssuePriorities(query: $query, first: $count, filter: { partOf: { any: { id: { eq: $template } } } }) {\n            ...DefaultIssuePriorityInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query firstIssuePriorities($template: ID!, $count: Int!) {\n        node(id: $template) {\n            ... on IssueTemplate {\n                issuePriorities(first: $count, orderBy: [{ field: VALUE }, { field: NAME }]) {\n                    nodes {\n                        ...DefaultIssuePriorityInfo\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query firstIssuePriorities($template: ID!, $count: Int!) {\n        node(id: $template) {\n            ... on IssueTemplate {\n                issuePriorities(first: $count, orderBy: [{ field: VALUE }, { field: NAME }]) {\n                    nodes {\n                        ...DefaultIssuePriorityInfo\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchIssueRelationTypes($template: ID!, $query: String!, $count: Int!) {\n        searchIssueRelationTypes(query: $query, first: $count, filter: { partOf: { any: { id: { eq: $template } } } }) {\n            ...DefaultIssueRelationTypeInfo\n        }\n    }\n"
): (typeof documents)["\n    query searchIssueRelationTypes($template: ID!, $query: String!, $count: Int!) {\n        searchIssueRelationTypes(query: $query, first: $count, filter: { partOf: { any: { id: { eq: $template } } } }) {\n            ...DefaultIssueRelationTypeInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query firstIssueRelationTypes($template: ID!, $count: Int!) {\n        node(id: $template) {\n            ... on IssueTemplate {\n                relationTypes(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultIssueRelationTypeInfo\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query firstIssueRelationTypes($template: ID!, $count: Int!) {\n        node(id: $template) {\n            ... on IssueTemplate {\n                relationTypes(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultIssueRelationTypeInfo\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchIssueStates($template: ID!, $query: String!, $count: Int!) {\n        searchIssueStates(query: $query, first: $count, filter: { partOf: { any: { id: { eq: $template } } } }) {\n            ...DefaultIssueStateInfo\n        }\n    }\n"
): (typeof documents)["\n    query searchIssueStates($template: ID!, $query: String!, $count: Int!) {\n        searchIssueStates(query: $query, first: $count, filter: { partOf: { any: { id: { eq: $template } } } }) {\n            ...DefaultIssueStateInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query firstIssueStates($template: ID!, $count: Int!) {\n        node(id: $template) {\n            ... on IssueTemplate {\n                issueStates(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultIssueStateInfo\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query firstIssueStates($template: ID!, $count: Int!) {\n        node(id: $template) {\n            ... on IssueTemplate {\n                issueStates(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultIssueStateInfo\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchIssueTemplates($query: String!, $count: Int!) {\n        searchIssueTemplates(query: $query, first: $count, filter: { isDeprecated: { eq: false } }) {\n            ...DefaultIssueTemplateInfo\n        }\n    }\n"
): (typeof documents)["\n    query searchIssueTemplates($query: String!, $count: Int!) {\n        searchIssueTemplates(query: $query, first: $count, filter: { isDeprecated: { eq: false } }) {\n            ...DefaultIssueTemplateInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query firstIssueTemplates($count: Int!) {\n        issueTemplates(first: $count, orderBy: [{ field: NAME }], filter: { isDeprecated: { eq: false } }) {\n            nodes {\n                ...DefaultIssueTemplateInfo\n            }\n        }\n    }\n"
): (typeof documents)["\n    query firstIssueTemplates($count: Int!) {\n        issueTemplates(first: $count, orderBy: [{ field: NAME }], filter: { isDeprecated: { eq: false } }) {\n            nodes {\n                ...DefaultIssueTemplateInfo\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchIssueTypes($template: ID!, $query: String!, $count: Int!) {\n        searchIssueTypes(query: $query, first: $count, filter: { partOf: { any: { id: { eq: $template } } } }) {\n            ...DefaultIssueTypeInfo\n        }\n    }\n"
): (typeof documents)["\n    query searchIssueTypes($template: ID!, $query: String!, $count: Int!) {\n        searchIssueTypes(query: $query, first: $count, filter: { partOf: { any: { id: { eq: $template } } } }) {\n            ...DefaultIssueTypeInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query firstIssueTypes($template: ID!, $count: Int!) {\n        node(id: $template) {\n            ... on IssueTemplate {\n                issueTypes(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultIssueTypeInfo\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query firstIssueTypes($template: ID!, $count: Int!) {\n        node(id: $template) {\n            ... on IssueTemplate {\n                issueTypes(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultIssueTypeInfo\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchLabels($issue: ID!, $query: String!, $count: Int!) {\n        searchLabels(\n            query: $query\n            first: $count\n            filter: { trackables: { any: { issues: { any: { id: { eq: $issue } } } } } }\n        ) {\n            ...DefaultLabelInfo\n        }\n    }\n"
): (typeof documents)["\n    query searchLabels($issue: ID!, $query: String!, $count: Int!) {\n        searchLabels(\n            query: $query\n            first: $count\n            filter: { trackables: { any: { issues: { any: { id: { eq: $issue } } } } } }\n        ) {\n            ...DefaultLabelInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query firstLabelsForAutocomplete($issue: ID!, $count: Int!) {\n        node(id: $issue) {\n            id\n            ... on Issue {\n                trackables {\n                    nodes {\n                        labels(first: $count, orderBy: [{ field: NAME }]) {\n                            nodes {\n                                ...DefaultLabelInfo\n                            }\n                        }\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query firstLabelsForAutocomplete($issue: ID!, $count: Int!) {\n        node(id: $issue) {\n            id\n            ... on Issue {\n                trackables {\n                    nodes {\n                        labels(first: $count, orderBy: [{ field: NAME }]) {\n                            nodes {\n                                ...DefaultLabelInfo\n                            }\n                        }\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchRelationTemplates($query: String!, $count: Int!, $filter: RelationTemplateFilterInput) {\n        searchRelationTemplates(query: $query, first: $count, filter: $filter) {\n            ...DefaultRelationTemplateInfo\n        }\n    }\n"
): (typeof documents)["\n    query searchRelationTemplates($query: String!, $count: Int!, $filter: RelationTemplateFilterInput) {\n        searchRelationTemplates(query: $query, first: $count, filter: $filter) {\n            ...DefaultRelationTemplateInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getRelationTemplates($count: Int!, $filter: RelationTemplateFilterInput) {\n        relationTemplates(first: $count, filter: $filter) {\n            nodes {\n                ...DefaultRelationTemplateInfo\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getRelationTemplates($count: Int!, $filter: RelationTemplateFilterInput) {\n        relationTemplates(first: $count, filter: $filter) {\n            nodes {\n                ...DefaultRelationTemplateInfo\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getSyncPermissionTargetForSwitch($id: ID!) {\n        node(id: $id) {\n            id\n            ... on IMS {\n                isSyncOthersAllowed\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getSyncPermissionTargetForSwitch($id: ID!) {\n        node(id: $id) {\n            id\n            ... on IMS {\n                isSyncOthersAllowed\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation updateSyncPermissionsForSwitch($input: UpdateSyncPermissionsInput!) {\n        updateSyncPermissions(input: $input) {\n            __typename\n        }\n    }\n"
): (typeof documents)["\n    mutation updateSyncPermissionsForSwitch($input: UpdateSyncPermissionsInput!) {\n        updateSyncPermissions(input: $input) {\n            __typename\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchTrackables($query: String!, $count: Int!, $filter: TrackableFilterInput) {\n        searchTrackables(query: $query, first: $count, filter: $filter) {\n            ...DefaultTrackableInfo\n        }\n    }\n"
): (typeof documents)["\n    query searchTrackables($query: String!, $count: Int!, $filter: TrackableFilterInput) {\n        searchTrackables(query: $query, first: $count, filter: $filter) {\n            ...DefaultTrackableInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query firstTrackables($count: Int!, $filter: TrackableFilterInput) {\n        trackables(first: $count, filter: $filter) {\n            nodes {\n                ...DefaultTrackableInfo\n            }\n        }\n    }\n"
): (typeof documents)["\n    query firstTrackables($count: Int!, $filter: TrackableFilterInput) {\n        trackables(first: $count, filter: $filter) {\n            nodes {\n                ...DefaultTrackableInfo\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchViews($project: ID!, $query: String!, $count: Int!) {\n        searchViews(query: $query, first: $count, filter: { project: { id: { eq: $project } } }) {\n            ...DefaultViewInfo\n        }\n    }\n"
): (typeof documents)["\n    query searchViews($project: ID!, $query: String!, $count: Int!) {\n        searchViews(query: $query, first: $count, filter: { project: { id: { eq: $project } } }) {\n            ...DefaultViewInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query firstViews($project: ID!, $count: Int!) {\n        node(id: $project) {\n            ... on Project {\n                views(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultViewInfo\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query firstViews($project: ID!, $count: Int!) {\n        node(id: $project) {\n            ... on Project {\n                views(first: $count, orderBy: [{ field: NAME }]) {\n                    nodes {\n                        ...DefaultViewInfo\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation updateBodyForTimeline($id: ID!, $body: String!) {\n        updateBody(input: { id: $id, body: $body }) {\n            body {\n                id\n                body\n                bodyLastEditedAt\n                bodyLastEditedBy {\n                    ...DefaultUserInfo\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation updateBodyForTimeline($id: ID!, $body: String!) {\n        updateBody(input: { id: $id, body: $body }) {\n            body {\n                id\n                body\n                bodyLastEditedAt\n                bodyLastEditedBy {\n                    ...DefaultUserInfo\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation updateIssueCommentForTimeline($id: ID!, $body: String!) {\n        updateIssueComment(input: { id: $id, body: $body }) {\n            issueComment {\n                id\n                body\n                bodyLastEditedAt\n                bodyLastEditedBy {\n                    ...DefaultUserInfo\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation updateIssueCommentForTimeline($id: ID!, $body: String!) {\n        updateIssueComment(input: { id: $id, body: $body }) {\n            issueComment {\n                id\n                body\n                bodyLastEditedAt\n                bodyLastEditedBy {\n                    ...DefaultUserInfo\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation createIssueCommentForTimeline($issue: ID!, $body: String!, $answers: ID) {\n        createIssueComment(input: { issue: $issue, body: $body, answers: $answers }) {\n            issueComment {\n                ...IssueCommentTimelineInfo\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation createIssueCommentForTimeline($issue: ID!, $body: String!, $answers: ID) {\n        createIssueComment(input: { issue: $issue, body: $body, answers: $answers }) {\n            issueComment {\n                ...IssueCommentTimelineInfo\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation deleteIssueCommentForTimeline($id: ID!) {\n        deleteIssueComment(input: { id: $id }) {\n            issueComment {\n                ...IssueCommentTimelineInfo\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation deleteIssueCommentForTimeline($id: ID!) {\n        deleteIssueComment(input: { id: $id }) {\n            issueComment {\n                ...IssueCommentTimelineInfo\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "fragment DefaultAffectedByIssueInfo on AffectedByIssue {\n  id\n  ... on Named {\n    name\n    description\n  }\n  ... on ComponentVersion {\n    version\n    component {\n      name\n      description\n    }\n  }\n  ... on InterfaceSpecificationVersion {\n    version\n    interfaceSpecification {\n      name\n      description\n    }\n  }\n  ... on Interface {\n    interfaceDefinition {\n      interfaceSpecificationVersion {\n        version\n        interfaceSpecification {\n          name\n          description\n        }\n      }\n    }\n  }\n  __typename\n}\n\nfragment DetailedAffectedByIssueInfo on AffectedByIssue {\n  ...DefaultAffectedByIssueInfo\n  ... on Component {\n    versions(first: $sublistCount) {\n      nodes {\n        id\n        version\n      }\n    }\n  }\n  ... on InterfaceSpecification {\n    versions(first: $sublistCount) {\n      nodes {\n        id\n        version\n        interfaceDefinitions(\n          first: $sublistCount\n          filter: {visibleInterface: {}, componentVersion: {component: {id: {eq: $trackable}}}}\n        ) {\n          nodes {\n            visibleInterface {\n              id\n            }\n          }\n        }\n      }\n    }\n  }\n  ... on InterfaceSpecificationVersion {\n    interfaceDefinitions(\n      first: $sublistCount\n      filter: {visibleInterface: {}, componentVersion: {component: {id: {eq: $trackable}}}}\n    ) {\n      nodes {\n        visibleInterface {\n          id\n        }\n      }\n    }\n  }\n}"
): (typeof documents)["fragment DefaultAffectedByIssueInfo on AffectedByIssue {\n  id\n  ... on Named {\n    name\n    description\n  }\n  ... on ComponentVersion {\n    version\n    component {\n      name\n      description\n    }\n  }\n  ... on InterfaceSpecificationVersion {\n    version\n    interfaceSpecification {\n      name\n      description\n    }\n  }\n  ... on Interface {\n    interfaceDefinition {\n      interfaceSpecificationVersion {\n        version\n        interfaceSpecification {\n          name\n          description\n        }\n      }\n    }\n  }\n  __typename\n}\n\nfragment DetailedAffectedByIssueInfo on AffectedByIssue {\n  ...DefaultAffectedByIssueInfo\n  ... on Component {\n    versions(first: $sublistCount) {\n      nodes {\n        id\n        version\n      }\n    }\n  }\n  ... on InterfaceSpecification {\n    versions(first: $sublistCount) {\n      nodes {\n        id\n        version\n        interfaceDefinitions(\n          first: $sublistCount\n          filter: {visibleInterface: {}, componentVersion: {component: {id: {eq: $trackable}}}}\n        ) {\n          nodes {\n            visibleInterface {\n              id\n            }\n          }\n        }\n      }\n    }\n  }\n  ... on InterfaceSpecificationVersion {\n    interfaceDefinitions(\n      first: $sublistCount\n      filter: {visibleInterface: {}, componentVersion: {component: {id: {eq: $trackable}}}}\n    ) {\n      nodes {\n        visibleInterface {\n          id\n        }\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "fragment DefaultAssignmentInfo on Assignment {\n  id\n  user {\n    ...UserTimelineInfo\n  }\n  type {\n    ...DefaultAssignmentTypeInfo\n  }\n}\n\nfragment DefaultAssignmentTypeInfo on AssignmentType {\n  id\n  name\n  description\n}"
): (typeof documents)["fragment DefaultAssignmentInfo on Assignment {\n  id\n  user {\n    ...UserTimelineInfo\n  }\n  type {\n    ...DefaultAssignmentTypeInfo\n  }\n}\n\nfragment DefaultAssignmentTypeInfo on AssignmentType {\n  id\n  name\n  description\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "fragment DefaultAssignmentTypeInfo on AssignmentType {\n  id\n  name\n  description\n}"
): (typeof documents)["fragment DefaultAssignmentTypeInfo on AssignmentType {\n  id\n  name\n  description\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "fragment ComponentListItemInfo on Component {\n  id\n  name\n  description\n  template {\n    id\n    name\n    description\n  }\n  ...OpenIssueCount\n}"
): (typeof documents)["fragment ComponentListItemInfo on Component {\n  id\n  name\n  description\n  template {\n    id\n    name\n    description\n  }\n  ...OpenIssueCount\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "fragment DefaultComponentPermissionInfo on ComponentPermission {\n  id\n  name\n  description\n  entries\n  allUsers\n  users {\n    totalCount\n    nodes {\n      id\n      name: displayName\n    }\n  }\n}"
): (typeof documents)["fragment DefaultComponentPermissionInfo on ComponentPermission {\n  id\n  name\n  description\n  entries\n  allUsers\n  users {\n    totalCount\n    nodes {\n      id\n      name: displayName\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "fragment DefaultComponentTemplateInfo on ComponentTemplate {\n  id\n  name\n  description\n  templateFieldSpecifications {\n    name\n    value\n  }\n}\n\nfragment DefaultComponentVersionTemplateInfo on ComponentVersionTemplate {\n  id\n  name\n  description\n  templateFieldSpecifications {\n    name\n    value\n  }\n}"
): (typeof documents)["fragment DefaultComponentTemplateInfo on ComponentTemplate {\n  id\n  name\n  description\n  templateFieldSpecifications {\n    name\n    value\n  }\n}\n\nfragment DefaultComponentVersionTemplateInfo on ComponentVersionTemplate {\n  id\n  name\n  description\n  templateFieldSpecifications {\n    name\n    value\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "fragment ComponentVersionListItemInfo on ComponentVersion {\n  id\n  version\n  tags\n  interfaceDefinitions(filter: {visibleInterface: {}}) {\n    totalCount\n  }\n}\n\nfragment DefaultComponentVersionInfo on ComponentVersion {\n  id\n  component {\n    name\n    description\n  }\n  version\n  __typename\n}"
): (typeof documents)["fragment ComponentVersionListItemInfo on ComponentVersion {\n  id\n  version\n  tags\n  interfaceDefinitions(filter: {visibleInterface: {}}) {\n    totalCount\n  }\n}\n\nfragment DefaultComponentVersionInfo on ComponentVersion {\n  id\n  component {\n    name\n    description\n  }\n  version\n  __typename\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "fragment DefaultGlobalPermissionInfo on GlobalPermission {\n  id\n  name\n  description\n  entries\n  allUsers\n  users {\n    totalCount\n    nodes {\n      id\n      name: displayName\n    }\n  }\n}"
): (typeof documents)["fragment DefaultGlobalPermissionInfo on GlobalPermission {\n  id\n  name\n  description\n  entries\n  allUsers\n  users {\n    totalCount\n    nodes {\n      id\n      name: displayName\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "fragment GraphInfo on Project {\n  components {\n    nodes {\n      ...GraphComponentVersionInfo\n    }\n  }\n  manageComponents: hasPermission(permission: MANAGE_COMPONENTS)\n  defaultView {\n    id\n  }\n}\n\nfragment GraphComponentVersionInfo on ComponentVersion {\n  version\n  ...GraphRelationPartnerInfo\n  interfaceDefinitions {\n    nodes {\n      visibleInterface {\n        ...GraphRelationPartnerInfo\n      }\n      interfaceSpecificationVersion {\n        id\n        version\n        interfaceSpecification {\n          id\n          name\n          template {\n            ...GraphRelationPartnerTemplateInfo\n          }\n        }\n      }\n    }\n  }\n  component {\n    id\n    name\n    template {\n      ...GraphRelationPartnerTemplateInfo\n    }\n  }\n  relateFromComponent: hasPermission(permission: RELATE_FROM_COMPONENT)\n}\n\nfragment GraphAggregatedIssueInfo on AggregatedIssue {\n  id\n  type {\n    id\n    name\n    iconPath\n  }\n  count\n  isOpen\n  outgoingRelations(filter: {end: {relationPartner: {partOfProject: $project}}}) {\n    nodes {\n      end {\n        id\n        relationPartner {\n          id\n        }\n      }\n      type {\n        name\n        id\n      }\n    }\n  }\n}\n\nfragment GraphRelationPartnerInfo on RelationPartner {\n  id\n  __typename\n  outgoingRelations(filter: {end: {partOfProject: $project}}) {\n    nodes {\n      id\n      template {\n        ...GraphRelationTemplateInfo\n      }\n      end {\n        id\n      }\n    }\n  }\n  aggregatedIssues {\n    nodes {\n      ...GraphAggregatedIssueInfo\n    }\n  }\n}\n\nfragment FillStyleInfo on FillStyle {\n  color\n}\n\nfragment StrokeStyleInfo on StrokeStyle {\n  color\n  dash\n}\n\nfragment GraphRelationPartnerTemplateInfo on RelationPartnerTemplate {\n  id\n  name\n  fill {\n    ...FillStyleInfo\n  }\n  stroke {\n    ...StrokeStyleInfo\n  }\n  shapeType\n  shapeRadius\n}\n\nfragment GraphRelationTemplateInfo on RelationTemplate {\n  name\n  stroke {\n    ...StrokeStyleInfo\n  }\n  markerType\n}"
): (typeof documents)["fragment GraphInfo on Project {\n  components {\n    nodes {\n      ...GraphComponentVersionInfo\n    }\n  }\n  manageComponents: hasPermission(permission: MANAGE_COMPONENTS)\n  defaultView {\n    id\n  }\n}\n\nfragment GraphComponentVersionInfo on ComponentVersion {\n  version\n  ...GraphRelationPartnerInfo\n  interfaceDefinitions {\n    nodes {\n      visibleInterface {\n        ...GraphRelationPartnerInfo\n      }\n      interfaceSpecificationVersion {\n        id\n        version\n        interfaceSpecification {\n          id\n          name\n          template {\n            ...GraphRelationPartnerTemplateInfo\n          }\n        }\n      }\n    }\n  }\n  component {\n    id\n    name\n    template {\n      ...GraphRelationPartnerTemplateInfo\n    }\n  }\n  relateFromComponent: hasPermission(permission: RELATE_FROM_COMPONENT)\n}\n\nfragment GraphAggregatedIssueInfo on AggregatedIssue {\n  id\n  type {\n    id\n    name\n    iconPath\n  }\n  count\n  isOpen\n  outgoingRelations(filter: {end: {relationPartner: {partOfProject: $project}}}) {\n    nodes {\n      end {\n        id\n        relationPartner {\n          id\n        }\n      }\n      type {\n        name\n        id\n      }\n    }\n  }\n}\n\nfragment GraphRelationPartnerInfo on RelationPartner {\n  id\n  __typename\n  outgoingRelations(filter: {end: {partOfProject: $project}}) {\n    nodes {\n      id\n      template {\n        ...GraphRelationTemplateInfo\n      }\n      end {\n        id\n      }\n    }\n  }\n  aggregatedIssues {\n    nodes {\n      ...GraphAggregatedIssueInfo\n    }\n  }\n}\n\nfragment FillStyleInfo on FillStyle {\n  color\n}\n\nfragment StrokeStyleInfo on StrokeStyle {\n  color\n  dash\n}\n\nfragment GraphRelationPartnerTemplateInfo on RelationPartnerTemplate {\n  id\n  name\n  fill {\n    ...FillStyleInfo\n  }\n  stroke {\n    ...StrokeStyleInfo\n  }\n  shapeType\n  shapeRadius\n}\n\nfragment GraphRelationTemplateInfo on RelationTemplate {\n  name\n  stroke {\n    ...StrokeStyleInfo\n  }\n  markerType\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "fragment DefaultIMSInfo on IMS {\n  id\n  name\n  description\n}\n\nfragment IMSListItemInfo on IMS {\n  ...DefaultSyncPermissionTargetInfo\n  template {\n    id\n    name\n    description\n  }\n}"
): (typeof documents)["fragment DefaultIMSInfo on IMS {\n  id\n  name\n  description\n}\n\nfragment IMSListItemInfo on IMS {\n  ...DefaultSyncPermissionTargetInfo\n  template {\n    id\n    name\n    description\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "fragment DefaultIMSPermissionInfo on IMSPermission {\n  id\n  name\n  description\n  entries\n  allUsers\n  users {\n    totalCount\n    nodes {\n      id\n      name: displayName\n    }\n  }\n}"
): (typeof documents)["fragment DefaultIMSPermissionInfo on IMSPermission {\n  id\n  name\n  description\n  entries\n  allUsers\n  users {\n    totalCount\n    nodes {\n      id\n      name: displayName\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "fragment DefaultIMSProjectInfo on IMSProject {\n  id\n  name\n  description\n  ims {\n    id\n    name\n    template {\n      id\n      name\n      description\n    }\n  }\n  ...DefaultSyncPermissionTargetInfo\n}"
): (typeof documents)["fragment DefaultIMSProjectInfo on IMSProject {\n  id\n  name\n  description\n  ims {\n    id\n    name\n    template {\n      id\n      name\n      description\n    }\n  }\n  ...DefaultSyncPermissionTargetInfo\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "fragment DefaultIMSTemplateInfo on IMSTemplate {\n  id\n  name\n  description\n  templateFieldSpecifications {\n    name\n    value\n  }\n}\n\nfragment DefaultIMSProjectTemplateInfo on IMSProjectTemplate {\n  id\n  name\n  description\n  templateFieldSpecifications {\n    name\n    value\n  }\n}"
): (typeof documents)["fragment DefaultIMSTemplateInfo on IMSTemplate {\n  id\n  name\n  description\n  templateFieldSpecifications {\n    name\n    value\n  }\n}\n\nfragment DefaultIMSProjectTemplateInfo on IMSProjectTemplate {\n  id\n  name\n  description\n  templateFieldSpecifications {\n    name\n    value\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "fragment DefaultInterfaceDefinitionInfo on InterfaceDefinition {\n  id\n  visibleSelfDefined\n  invisibleSelfDefined\n  visibleDerivedBy {\n    totalCount\n  }\n  invisibleDerivedBy {\n    totalCount\n  }\n}"
): (typeof documents)["fragment DefaultInterfaceDefinitionInfo on InterfaceDefinition {\n  id\n  visibleSelfDefined\n  invisibleSelfDefined\n  visibleDerivedBy {\n    totalCount\n  }\n  invisibleDerivedBy {\n    totalCount\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "fragment InterfaceSpecificationListItemInfo on InterfaceSpecification {\n  id\n  name\n  description\n  template {\n    id\n    name\n    description\n  }\n}\n\nfragment DefaultInterfaceSpecificationInfo on InterfaceSpecification {\n  id\n  name\n  description\n}"
): (typeof documents)["fragment InterfaceSpecificationListItemInfo on InterfaceSpecification {\n  id\n  name\n  description\n  template {\n    id\n    name\n    description\n  }\n}\n\nfragment DefaultInterfaceSpecificationInfo on InterfaceSpecification {\n  id\n  name\n  description\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "fragment DefaultInterfaceSpecificationTemplateInfo on InterfaceSpecificationTemplate {\n  id\n  name\n  description\n  templateFieldSpecifications {\n    name\n    value\n  }\n}\n\nfragment DefaultInterfaceSpecificationVersionTemplateInfo on InterfaceSpecificationVersionTemplate {\n  id\n  name\n  description\n  templateFieldSpecifications {\n    name\n    value\n  }\n}"
): (typeof documents)["fragment DefaultInterfaceSpecificationTemplateInfo on InterfaceSpecificationTemplate {\n  id\n  name\n  description\n  templateFieldSpecifications {\n    name\n    value\n  }\n}\n\nfragment DefaultInterfaceSpecificationVersionTemplateInfo on InterfaceSpecificationVersionTemplate {\n  id\n  name\n  description\n  templateFieldSpecifications {\n    name\n    value\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "fragment InterfaceSpecificationVersionListItemInfo on InterfaceSpecificationVersion {\n  id\n  version\n  tags\n}\n\nfragment DefaultInterfaceSpecificationVersionInfo on InterfaceSpecificationVersion {\n  id\n  interfaceSpecification {\n    name\n    description\n  }\n  version\n  __typename\n}"
): (typeof documents)["fragment InterfaceSpecificationVersionListItemInfo on InterfaceSpecificationVersion {\n  id\n  version\n  tags\n}\n\nfragment DefaultInterfaceSpecificationVersionInfo on InterfaceSpecificationVersion {\n  id\n  interfaceSpecification {\n    name\n    description\n  }\n  version\n  __typename\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "fragment DefaultIssueInfo on Issue {\n  ...DefaultIssueIconInfo\n  id\n  title\n  trackables {\n    nodes {\n      ...DefaultTrackableInfo\n    }\n  }\n}\n\nfragment IssueListItemInfo on Issue {\n  id\n  title\n  createdAt\n  createdBy {\n    ...DefaultUserInfo\n  }\n  state {\n    id\n    name\n  }\n  ...DefaultIssueIconInfo\n  issueComments {\n    totalCount\n  }\n  labels {\n    nodes {\n      ...DefaultLabelInfo\n      trackables {\n        nodes {\n          id\n          name\n          description\n        }\n      }\n    }\n  }\n  assignments {\n    nodes {\n      user {\n        ...DefaultUserInfo\n      }\n    }\n  }\n  priority {\n    ...DefaultIssuePriorityInfo\n  }\n  template {\n    id\n    name\n    description\n  }\n  type {\n    id\n    name\n    iconPath\n  }\n  affects {\n    nodes {\n      id\n    }\n  }\n}\n\nfragment ParticipatingIssueListItemInfo on Issue {\n  ...IssueListItemInfo\n  trackables(first: 1) {\n    nodes {\n      __typename\n      id\n      name\n      description\n    }\n    totalCount\n  }\n}\n\nfragment ProjectComponentIssueListItemInfo on Issue {\n  ...IssueListItemInfo\n  trackables(\n    filter: {isComponentAnd: {versions: {any: {partOfProject: $project}}}}\n  ) {\n    nodes {\n      __typename\n      id\n      name\n      description\n    }\n    totalCount\n  }\n}\n\nfragment DefaultIssueIconInfo on Issue {\n  incomingRelations {\n    totalCount\n  }\n  outgoingRelations {\n    totalCount\n  }\n  state {\n    isOpen\n  }\n  type {\n    iconPath\n  }\n}"
): (typeof documents)["fragment DefaultIssueInfo on Issue {\n  ...DefaultIssueIconInfo\n  id\n  title\n  trackables {\n    nodes {\n      ...DefaultTrackableInfo\n    }\n  }\n}\n\nfragment IssueListItemInfo on Issue {\n  id\n  title\n  createdAt\n  createdBy {\n    ...DefaultUserInfo\n  }\n  state {\n    id\n    name\n  }\n  ...DefaultIssueIconInfo\n  issueComments {\n    totalCount\n  }\n  labels {\n    nodes {\n      ...DefaultLabelInfo\n      trackables {\n        nodes {\n          id\n          name\n          description\n        }\n      }\n    }\n  }\n  assignments {\n    nodes {\n      user {\n        ...DefaultUserInfo\n      }\n    }\n  }\n  priority {\n    ...DefaultIssuePriorityInfo\n  }\n  template {\n    id\n    name\n    description\n  }\n  type {\n    id\n    name\n    iconPath\n  }\n  affects {\n    nodes {\n      id\n    }\n  }\n}\n\nfragment ParticipatingIssueListItemInfo on Issue {\n  ...IssueListItemInfo\n  trackables(first: 1) {\n    nodes {\n      __typename\n      id\n      name\n      description\n    }\n    totalCount\n  }\n}\n\nfragment ProjectComponentIssueListItemInfo on Issue {\n  ...IssueListItemInfo\n  trackables(\n    filter: {isComponentAnd: {versions: {any: {partOfProject: $project}}}}\n  ) {\n    nodes {\n      __typename\n      id\n      name\n      description\n    }\n    totalCount\n  }\n}\n\nfragment DefaultIssueIconInfo on Issue {\n  incomingRelations {\n    totalCount\n  }\n  outgoingRelations {\n    totalCount\n  }\n  state {\n    isOpen\n  }\n  type {\n    iconPath\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "fragment DefaultIssuePriorityInfo on IssuePriority {\n  id\n  name\n  description\n  value\n}"
): (typeof documents)["fragment DefaultIssuePriorityInfo on IssuePriority {\n  id\n  name\n  description\n  value\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "fragment DefaultIssueRelationTypeInfo on IssueRelationType {\n  id\n  name\n  description\n}"
): (typeof documents)["fragment DefaultIssueRelationTypeInfo on IssueRelationType {\n  id\n  name\n  description\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "fragment DefaultIssueStateInfo on IssueState {\n  id\n  name\n  description\n  isOpen\n}"
): (typeof documents)["fragment DefaultIssueStateInfo on IssueState {\n  id\n  name\n  description\n  isOpen\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "fragment DefaultIssueTemplateInfo on IssueTemplate {\n  id\n  name\n  description\n  templateFieldSpecifications {\n    name\n    value\n  }\n}\n\nfragment IssueTemplateFields on IssueTemplate {\n  id\n  name\n  description\n  extends {\n    nodes {\n      id\n    }\n  }\n  issueTypes {\n    nodes {\n      name\n      description\n      iconPath\n    }\n  }\n  issuePriorities {\n    nodes {\n      name\n      description\n      value\n      iconPath\n    }\n  }\n  issueStates {\n    nodes {\n      name\n      description\n      isOpen\n    }\n  }\n  assignmentTypes {\n    nodes {\n      name\n      description\n    }\n  }\n  relationTypes {\n    nodes {\n      name\n      description\n      inverseName\n    }\n  }\n  templateFieldSpecifications {\n    name\n    value\n  }\n}"
): (typeof documents)["fragment DefaultIssueTemplateInfo on IssueTemplate {\n  id\n  name\n  description\n  templateFieldSpecifications {\n    name\n    value\n  }\n}\n\nfragment IssueTemplateFields on IssueTemplate {\n  id\n  name\n  description\n  extends {\n    nodes {\n      id\n    }\n  }\n  issueTypes {\n    nodes {\n      name\n      description\n      iconPath\n    }\n  }\n  issuePriorities {\n    nodes {\n      name\n      description\n      value\n      iconPath\n    }\n  }\n  issueStates {\n    nodes {\n      name\n      description\n      isOpen\n    }\n  }\n  assignmentTypes {\n    nodes {\n      name\n      description\n    }\n  }\n  relationTypes {\n    nodes {\n      name\n      description\n      inverseName\n    }\n  }\n  templateFieldSpecifications {\n    name\n    value\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "fragment DefaultIssueTypeInfo on IssueType {\n  id\n  name\n  description\n  iconPath\n}"
): (typeof documents)["fragment DefaultIssueTypeInfo on IssueType {\n  id\n  name\n  description\n  iconPath\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "fragment DefaultLabelInfo on Label {\n  id\n  name\n  description\n  color\n}"
): (typeof documents)["fragment DefaultLabelInfo on Label {\n  id\n  name\n  description\n  color\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "fragment BaseLegalInformationInfo on LegalInformation {\n  id\n  label\n  priority\n}\n\nfragment DefaultLegalInformationInfo on LegalInformation {\n  ...BaseLegalInformationInfo\n  text\n}"
): (typeof documents)["fragment BaseLegalInformationInfo on LegalInformation {\n  id\n  label\n  priority\n}\n\nfragment DefaultLegalInformationInfo on LegalInformation {\n  ...BaseLegalInformationInfo\n  text\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "fragment ProjectListItemInfo on Project {\n  id\n  name\n  description\n  ...OpenIssueCount\n}"
): (typeof documents)["fragment ProjectListItemInfo on Project {\n  id\n  name\n  description\n  ...OpenIssueCount\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "fragment DefaultProjectPermissionInfo on ProjectPermission {\n  id\n  name\n  description\n  entries\n  allUsers\n  users {\n    totalCount\n    nodes {\n      id\n      name: displayName\n    }\n  }\n}"
): (typeof documents)["fragment DefaultProjectPermissionInfo on ProjectPermission {\n  id\n  name\n  description\n  entries\n  allUsers\n  users {\n    totalCount\n    nodes {\n      id\n      name: displayName\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "fragment DefaultRelationTemplateInfo on RelationTemplate {\n  id\n  name\n  description\n}"
): (typeof documents)["fragment DefaultRelationTemplateInfo on RelationTemplate {\n  id\n  name\n  description\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "fragment DefaultSyncPermissionTargetInfo on SyncPermissionTarget {\n  __typename\n  id\n  name\n  description\n  isSyncSelfAllowed\n  isSyncOthersAllowed\n}"
): (typeof documents)["fragment DefaultSyncPermissionTargetInfo on SyncPermissionTarget {\n  __typename\n  id\n  name\n  description\n  isSyncSelfAllowed\n  isSyncOthersAllowed\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "fragment DefaultTimelineItemInfo on TimelineItem {\n  ... on AddedAffectedEntityEvent {\n    ...AddedAffectedEntityEventTimelineInfo\n  }\n  ... on AddedArtefactEvent {\n    ...AddedArtefactEventTimelineInfo\n  }\n  ... on AddedLabelEvent {\n    ...AddedLabelEventTimelineInfo\n  }\n  ... on AddedToPinnedIssuesEvent {\n    ...AddedToPinnedIssuesEventTimelineInfo\n  }\n  ... on AddedToTrackableEvent {\n    ...AddedToTrackableEventTimelineInfo\n  }\n  ... on Assignment {\n    ...AssignmentTimelineInfo\n  }\n  ... on AssignmentTypeChangedEvent {\n    ...AssignmentTypeChangedEventTimelineInfo\n  }\n  ... on Body {\n    ...BodyTimelineInfo\n  }\n  ... on IncomingRelationTypeChangedEvent {\n    ...IncomingRelationTypeChangedEventTimelineInfo\n  }\n  ... on IssueComment {\n    ...IssueCommentTimelineInfo\n  }\n  ... on IssueRelation {\n    ...IssueRelationTimelineInfo\n  }\n  ... on OutgoingRelationTypeChangedEvent {\n    ...OutgoingRelationTypeChangedEventTimelineInfo\n  }\n  ... on PriorityChangedEvent {\n    ...PriorityChangedEventTimelineInfo\n  }\n  ... on RelatedByIssueEvent {\n    ...RelatedByIssueEventTimelineInfo\n  }\n  ... on RemovedAffectedEntityEvent {\n    ...RemovedAffectedEntityEventTimelineInfo\n  }\n  ... on RemovedArtefactEvent {\n    ...RemovedArtefactEventTimelineInfo\n  }\n  ... on RemovedAssignmentEvent {\n    ...RemovedAssignmentEventTimelineInfo\n  }\n  ... on RemovedFromPinnedIssuesEvent {\n    ...RemovedFromPinnedIssuesEventTimelineInfo\n  }\n  ... on RemovedFromTrackableEvent {\n    ...RemovedFromTrackableEventTimelineInfo\n  }\n  ... on RemovedIncomingRelationEvent {\n    ...RemovedIncomingRelationEventTimelineInfo\n  }\n  ... on RemovedLabelEvent {\n    ...RemovedLabelEventTimelineInfo\n  }\n  ... on RemovedOutgoingRelationEvent {\n    ...RemovedOutgoingRelationEventTimelineInfo\n  }\n  ... on RemovedTemplatedFieldEvent {\n    ...RemovedTemplatedFieldEventTimelineInfo\n  }\n  ... on StateChangedEvent {\n    ...StateChangedEventTimelineInfo\n  }\n  ... on TemplateChangedEvent {\n    ...TemplateChangedEventTimelineInfo\n  }\n  ... on TemplatedFieldChangedEvent {\n    ...TemplatedFieldChangedEventTimelineInfo\n  }\n  ... on TitleChangedEvent {\n    ...TitleChangedEventTimelineInfo\n  }\n  ... on TypeChangedEvent {\n    ...TypeChangedEventTimelineInfo\n  }\n}\n\nfragment TimelineItemInfo on TimelineItem {\n  id\n  createdAt\n  __typename\n  createdBy {\n    ...UserTimelineInfo\n  }\n}\n\nfragment AddedAffectedEntityEventTimelineInfo on AddedAffectedEntityEvent {\n  ...TimelineItemInfo\n  addedAffectedEntity {\n    ...AffectedByIssueTimelineInfo\n  }\n}\n\nfragment AddedArtefactEventTimelineInfo on AddedArtefactEvent {\n  ...TimelineItemInfo\n  addedArtefact {\n    ...ArtefactTimelineInfo\n  }\n}\n\nfragment AddedLabelEventTimelineInfo on AddedLabelEvent {\n  ...TimelineItemInfo\n  addedLabel {\n    ...LabelTimelineInfo\n  }\n}\n\nfragment AddedToPinnedIssuesEventTimelineInfo on AddedToPinnedIssuesEvent {\n  ...TimelineItemInfo\n  pinnedOn {\n    ...TrackableTimelineInfo\n  }\n}\n\nfragment AddedToTrackableEventTimelineInfo on AddedToTrackableEvent {\n  ...TimelineItemInfo\n  addedToTrackable {\n    ...TrackableTimelineInfo\n  }\n}\n\nfragment AssignmentTimelineInfo on Assignment {\n  ...TimelineItemInfo\n  ...DefaultAssignmentInfo\n  initialType {\n    ...AssignmentTypeTimelineInfo\n  }\n}\n\nfragment AssignmentTypeChangedEventTimelineInfo on AssignmentTypeChangedEvent {\n  ...TimelineItemInfo\n  assignment {\n    ...AssignmentTimelineInfo\n  }\n  newAssignmentType: newType {\n    ...AssignmentTypeTimelineInfo\n  }\n  oldAssignmentType: oldType {\n    ...AssignmentTypeTimelineInfo\n  }\n}\n\nfragment BodyTimelineInfo on Body {\n  ...TimelineItemInfo\n  ...CommentTimelineInfo\n}\n\nfragment IncomingRelationTypeChangedEventTimelineInfo on IncomingRelationTypeChangedEvent {\n  ...RelationTypeChangedEventTimelineInfo\n  issueRelation {\n    ...IncomingRelationTimelineInfo\n  }\n}\n\nfragment IssueCommentTimelineInfo on IssueComment {\n  ...TimelineItemInfo\n  ...CommentTimelineInfo\n  isDeleted\n  answers {\n    id\n  }\n}\n\nfragment IssueRelationTimelineInfo on IssueRelation {\n  ...TimelineItemInfo\n  ...OutgoingRelationTimelineInfo\n}\n\nfragment OutgoingRelationTypeChangedEventTimelineInfo on OutgoingRelationTypeChangedEvent {\n  ...RelationTypeChangedEventTimelineInfo\n  issueRelation {\n    ...OutgoingRelationTimelineInfo\n  }\n}\n\nfragment PriorityChangedEventTimelineInfo on PriorityChangedEvent {\n  ...TimelineItemInfo\n  oldPriority {\n    ...IssuePriorityTimelineInfo\n  }\n  newPriority {\n    ...IssuePriorityTimelineInfo\n  }\n}\n\nfragment RelatedByIssueEventTimelineInfo on RelatedByIssueEvent {\n  ...TimelineItemInfo\n  relation {\n    ...IncomingRelationTimelineInfo\n  }\n}\n\nfragment RelationTypeChangedEventTimelineInfo on RelationTypeChangedEvent {\n  ...TimelineItemInfo\n  oldRelationType: oldType {\n    ...IssueRelationTypeTimelineInfo\n  }\n  newRelationType: newType {\n    ...IssueRelationTypeTimelineInfo\n  }\n}\n\nfragment RemovedAffectedEntityEventTimelineInfo on RemovedAffectedEntityEvent {\n  ...TimelineItemInfo\n  removedAffectedEntity {\n    ...AffectedByIssueTimelineInfo\n  }\n}\n\nfragment RemovedArtefactEventTimelineInfo on RemovedArtefactEvent {\n  ...TimelineItemInfo\n  removedArtefact {\n    ...ArtefactTimelineInfo\n  }\n}\n\nfragment RemovedAssignmentEventTimelineInfo on RemovedAssignmentEvent {\n  ...TimelineItemInfo\n  removedAssignment {\n    ...AssignmentTimelineInfo\n  }\n}\n\nfragment RemovedFromPinnedIssuesEventTimelineInfo on RemovedFromPinnedIssuesEvent {\n  ...TimelineItemInfo\n  unpinnedOn {\n    ...TrackableTimelineInfo\n  }\n}\n\nfragment RemovedFromTrackableEventTimelineInfo on RemovedFromTrackableEvent {\n  ...TimelineItemInfo\n  removedFromTrackable {\n    ...TrackableTimelineInfo\n  }\n}\n\nfragment RemovedIncomingRelationEventTimelineInfo on RemovedIncomingRelationEvent {\n  ...TimelineItemInfo\n  removedRelation {\n    ...IncomingRelationTimelineInfo\n  }\n}\n\nfragment RemovedLabelEventTimelineInfo on RemovedLabelEvent {\n  ...TimelineItemInfo\n  removedLabel {\n    ...LabelTimelineInfo\n  }\n}\n\nfragment RemovedOutgoingRelationEventTimelineInfo on RemovedOutgoingRelationEvent {\n  ...TimelineItemInfo\n  removedRelation {\n    ...OutgoingRelationTimelineInfo\n  }\n}\n\nfragment RemovedTemplatedFieldEventTimelineInfo on RemovedTemplatedFieldEvent {\n  ...TimelineItemInfo\n  fieldName\n}\n\nfragment StateChangedEventTimelineInfo on StateChangedEvent {\n  ...TimelineItemInfo\n  oldState {\n    ...IssueStateTimelineInfo\n  }\n  newState {\n    ...IssueStateTimelineInfo\n  }\n}\n\nfragment TemplateChangedEventTimelineInfo on TemplateChangedEvent {\n  ...TimelineItemInfo\n  oldTemplate {\n    ...IssueTemplateTimelineInfo\n  }\n  newTemplate {\n    ...IssueTemplateTimelineInfo\n  }\n}\n\nfragment TemplatedFieldChangedEventTimelineInfo on TemplatedFieldChangedEvent {\n  ...TimelineItemInfo\n  fieldName\n  oldValue\n  newValue\n}\n\nfragment TitleChangedEventTimelineInfo on TitleChangedEvent {\n  ...TimelineItemInfo\n  oldTitle\n  newTitle\n}\n\nfragment TypeChangedEventTimelineInfo on TypeChangedEvent {\n  ...TimelineItemInfo\n  newIssueType: newType {\n    ...IssueTypeTimelineInfo\n  }\n  oldIssueType: oldType {\n    ...IssueTypeTimelineInfo\n  }\n}\n\nfragment IssueTypeTimelineInfo on IssueType {\n  ...DefaultIssueTypeInfo\n}\n\nfragment AffectedByIssueTimelineInfo on AffectedByIssue {\n  ...DefaultAffectedByIssueInfo\n}\n\nfragment ArtefactTimelineInfo on Artefact {\n  file\n  id\n}\n\nfragment UserTimelineInfo on User {\n  ...DefaultUserInfo\n}\n\nfragment LabelTimelineInfo on Label {\n  ...DefaultLabelInfo\n}\n\nfragment TrackableTimelineInfo on Trackable {\n  ...DefaultTrackableInfo\n}\n\nfragment AssignmentTypeTimelineInfo on AssignmentType {\n  ...DefaultAssignmentTypeInfo\n}\n\nfragment CommentTimelineInfo on Comment {\n  body\n  bodyLastEditedAt\n  bodyLastEditedBy {\n    ...UserTimelineInfo\n  }\n}\n\nfragment IssueRelationTypeTimelineInfo on IssueRelationType {\n  id\n  name\n  inverseName\n  description\n}\n\nfragment IssueRelationTimelineInfoBase on IssueRelation {\n  type {\n    ...IssueRelationTypeTimelineInfo\n  }\n  initialType {\n    ...IssueRelationTypeTimelineInfo\n  }\n}\n\nfragment IncomingRelationTimelineInfo on IssueRelation {\n  id\n  ...IssueRelationTimelineInfoBase\n  issue {\n    ...IssueTimelineInfo\n  }\n}\n\nfragment OutgoingRelationTimelineInfo on IssueRelation {\n  id\n  ...IssueRelationTimelineInfoBase\n  relatedIssue {\n    ...IssueTimelineInfo\n  }\n}\n\nfragment IssueTimelineInfo on Issue {\n  ...DefaultIssueInfo\n}\n\nfragment IssuePriorityTimelineInfo on IssuePriority {\n  ...DefaultIssuePriorityInfo\n}\n\nfragment IssueStateTimelineInfo on IssueState {\n  ...DefaultIssueStateInfo\n}\n\nfragment IssueTemplateTimelineInfo on IssueTemplate {\n  name\n  description\n}"
): (typeof documents)["fragment DefaultTimelineItemInfo on TimelineItem {\n  ... on AddedAffectedEntityEvent {\n    ...AddedAffectedEntityEventTimelineInfo\n  }\n  ... on AddedArtefactEvent {\n    ...AddedArtefactEventTimelineInfo\n  }\n  ... on AddedLabelEvent {\n    ...AddedLabelEventTimelineInfo\n  }\n  ... on AddedToPinnedIssuesEvent {\n    ...AddedToPinnedIssuesEventTimelineInfo\n  }\n  ... on AddedToTrackableEvent {\n    ...AddedToTrackableEventTimelineInfo\n  }\n  ... on Assignment {\n    ...AssignmentTimelineInfo\n  }\n  ... on AssignmentTypeChangedEvent {\n    ...AssignmentTypeChangedEventTimelineInfo\n  }\n  ... on Body {\n    ...BodyTimelineInfo\n  }\n  ... on IncomingRelationTypeChangedEvent {\n    ...IncomingRelationTypeChangedEventTimelineInfo\n  }\n  ... on IssueComment {\n    ...IssueCommentTimelineInfo\n  }\n  ... on IssueRelation {\n    ...IssueRelationTimelineInfo\n  }\n  ... on OutgoingRelationTypeChangedEvent {\n    ...OutgoingRelationTypeChangedEventTimelineInfo\n  }\n  ... on PriorityChangedEvent {\n    ...PriorityChangedEventTimelineInfo\n  }\n  ... on RelatedByIssueEvent {\n    ...RelatedByIssueEventTimelineInfo\n  }\n  ... on RemovedAffectedEntityEvent {\n    ...RemovedAffectedEntityEventTimelineInfo\n  }\n  ... on RemovedArtefactEvent {\n    ...RemovedArtefactEventTimelineInfo\n  }\n  ... on RemovedAssignmentEvent {\n    ...RemovedAssignmentEventTimelineInfo\n  }\n  ... on RemovedFromPinnedIssuesEvent {\n    ...RemovedFromPinnedIssuesEventTimelineInfo\n  }\n  ... on RemovedFromTrackableEvent {\n    ...RemovedFromTrackableEventTimelineInfo\n  }\n  ... on RemovedIncomingRelationEvent {\n    ...RemovedIncomingRelationEventTimelineInfo\n  }\n  ... on RemovedLabelEvent {\n    ...RemovedLabelEventTimelineInfo\n  }\n  ... on RemovedOutgoingRelationEvent {\n    ...RemovedOutgoingRelationEventTimelineInfo\n  }\n  ... on RemovedTemplatedFieldEvent {\n    ...RemovedTemplatedFieldEventTimelineInfo\n  }\n  ... on StateChangedEvent {\n    ...StateChangedEventTimelineInfo\n  }\n  ... on TemplateChangedEvent {\n    ...TemplateChangedEventTimelineInfo\n  }\n  ... on TemplatedFieldChangedEvent {\n    ...TemplatedFieldChangedEventTimelineInfo\n  }\n  ... on TitleChangedEvent {\n    ...TitleChangedEventTimelineInfo\n  }\n  ... on TypeChangedEvent {\n    ...TypeChangedEventTimelineInfo\n  }\n}\n\nfragment TimelineItemInfo on TimelineItem {\n  id\n  createdAt\n  __typename\n  createdBy {\n    ...UserTimelineInfo\n  }\n}\n\nfragment AddedAffectedEntityEventTimelineInfo on AddedAffectedEntityEvent {\n  ...TimelineItemInfo\n  addedAffectedEntity {\n    ...AffectedByIssueTimelineInfo\n  }\n}\n\nfragment AddedArtefactEventTimelineInfo on AddedArtefactEvent {\n  ...TimelineItemInfo\n  addedArtefact {\n    ...ArtefactTimelineInfo\n  }\n}\n\nfragment AddedLabelEventTimelineInfo on AddedLabelEvent {\n  ...TimelineItemInfo\n  addedLabel {\n    ...LabelTimelineInfo\n  }\n}\n\nfragment AddedToPinnedIssuesEventTimelineInfo on AddedToPinnedIssuesEvent {\n  ...TimelineItemInfo\n  pinnedOn {\n    ...TrackableTimelineInfo\n  }\n}\n\nfragment AddedToTrackableEventTimelineInfo on AddedToTrackableEvent {\n  ...TimelineItemInfo\n  addedToTrackable {\n    ...TrackableTimelineInfo\n  }\n}\n\nfragment AssignmentTimelineInfo on Assignment {\n  ...TimelineItemInfo\n  ...DefaultAssignmentInfo\n  initialType {\n    ...AssignmentTypeTimelineInfo\n  }\n}\n\nfragment AssignmentTypeChangedEventTimelineInfo on AssignmentTypeChangedEvent {\n  ...TimelineItemInfo\n  assignment {\n    ...AssignmentTimelineInfo\n  }\n  newAssignmentType: newType {\n    ...AssignmentTypeTimelineInfo\n  }\n  oldAssignmentType: oldType {\n    ...AssignmentTypeTimelineInfo\n  }\n}\n\nfragment BodyTimelineInfo on Body {\n  ...TimelineItemInfo\n  ...CommentTimelineInfo\n}\n\nfragment IncomingRelationTypeChangedEventTimelineInfo on IncomingRelationTypeChangedEvent {\n  ...RelationTypeChangedEventTimelineInfo\n  issueRelation {\n    ...IncomingRelationTimelineInfo\n  }\n}\n\nfragment IssueCommentTimelineInfo on IssueComment {\n  ...TimelineItemInfo\n  ...CommentTimelineInfo\n  isDeleted\n  answers {\n    id\n  }\n}\n\nfragment IssueRelationTimelineInfo on IssueRelation {\n  ...TimelineItemInfo\n  ...OutgoingRelationTimelineInfo\n}\n\nfragment OutgoingRelationTypeChangedEventTimelineInfo on OutgoingRelationTypeChangedEvent {\n  ...RelationTypeChangedEventTimelineInfo\n  issueRelation {\n    ...OutgoingRelationTimelineInfo\n  }\n}\n\nfragment PriorityChangedEventTimelineInfo on PriorityChangedEvent {\n  ...TimelineItemInfo\n  oldPriority {\n    ...IssuePriorityTimelineInfo\n  }\n  newPriority {\n    ...IssuePriorityTimelineInfo\n  }\n}\n\nfragment RelatedByIssueEventTimelineInfo on RelatedByIssueEvent {\n  ...TimelineItemInfo\n  relation {\n    ...IncomingRelationTimelineInfo\n  }\n}\n\nfragment RelationTypeChangedEventTimelineInfo on RelationTypeChangedEvent {\n  ...TimelineItemInfo\n  oldRelationType: oldType {\n    ...IssueRelationTypeTimelineInfo\n  }\n  newRelationType: newType {\n    ...IssueRelationTypeTimelineInfo\n  }\n}\n\nfragment RemovedAffectedEntityEventTimelineInfo on RemovedAffectedEntityEvent {\n  ...TimelineItemInfo\n  removedAffectedEntity {\n    ...AffectedByIssueTimelineInfo\n  }\n}\n\nfragment RemovedArtefactEventTimelineInfo on RemovedArtefactEvent {\n  ...TimelineItemInfo\n  removedArtefact {\n    ...ArtefactTimelineInfo\n  }\n}\n\nfragment RemovedAssignmentEventTimelineInfo on RemovedAssignmentEvent {\n  ...TimelineItemInfo\n  removedAssignment {\n    ...AssignmentTimelineInfo\n  }\n}\n\nfragment RemovedFromPinnedIssuesEventTimelineInfo on RemovedFromPinnedIssuesEvent {\n  ...TimelineItemInfo\n  unpinnedOn {\n    ...TrackableTimelineInfo\n  }\n}\n\nfragment RemovedFromTrackableEventTimelineInfo on RemovedFromTrackableEvent {\n  ...TimelineItemInfo\n  removedFromTrackable {\n    ...TrackableTimelineInfo\n  }\n}\n\nfragment RemovedIncomingRelationEventTimelineInfo on RemovedIncomingRelationEvent {\n  ...TimelineItemInfo\n  removedRelation {\n    ...IncomingRelationTimelineInfo\n  }\n}\n\nfragment RemovedLabelEventTimelineInfo on RemovedLabelEvent {\n  ...TimelineItemInfo\n  removedLabel {\n    ...LabelTimelineInfo\n  }\n}\n\nfragment RemovedOutgoingRelationEventTimelineInfo on RemovedOutgoingRelationEvent {\n  ...TimelineItemInfo\n  removedRelation {\n    ...OutgoingRelationTimelineInfo\n  }\n}\n\nfragment RemovedTemplatedFieldEventTimelineInfo on RemovedTemplatedFieldEvent {\n  ...TimelineItemInfo\n  fieldName\n}\n\nfragment StateChangedEventTimelineInfo on StateChangedEvent {\n  ...TimelineItemInfo\n  oldState {\n    ...IssueStateTimelineInfo\n  }\n  newState {\n    ...IssueStateTimelineInfo\n  }\n}\n\nfragment TemplateChangedEventTimelineInfo on TemplateChangedEvent {\n  ...TimelineItemInfo\n  oldTemplate {\n    ...IssueTemplateTimelineInfo\n  }\n  newTemplate {\n    ...IssueTemplateTimelineInfo\n  }\n}\n\nfragment TemplatedFieldChangedEventTimelineInfo on TemplatedFieldChangedEvent {\n  ...TimelineItemInfo\n  fieldName\n  oldValue\n  newValue\n}\n\nfragment TitleChangedEventTimelineInfo on TitleChangedEvent {\n  ...TimelineItemInfo\n  oldTitle\n  newTitle\n}\n\nfragment TypeChangedEventTimelineInfo on TypeChangedEvent {\n  ...TimelineItemInfo\n  newIssueType: newType {\n    ...IssueTypeTimelineInfo\n  }\n  oldIssueType: oldType {\n    ...IssueTypeTimelineInfo\n  }\n}\n\nfragment IssueTypeTimelineInfo on IssueType {\n  ...DefaultIssueTypeInfo\n}\n\nfragment AffectedByIssueTimelineInfo on AffectedByIssue {\n  ...DefaultAffectedByIssueInfo\n}\n\nfragment ArtefactTimelineInfo on Artefact {\n  file\n  id\n}\n\nfragment UserTimelineInfo on User {\n  ...DefaultUserInfo\n}\n\nfragment LabelTimelineInfo on Label {\n  ...DefaultLabelInfo\n}\n\nfragment TrackableTimelineInfo on Trackable {\n  ...DefaultTrackableInfo\n}\n\nfragment AssignmentTypeTimelineInfo on AssignmentType {\n  ...DefaultAssignmentTypeInfo\n}\n\nfragment CommentTimelineInfo on Comment {\n  body\n  bodyLastEditedAt\n  bodyLastEditedBy {\n    ...UserTimelineInfo\n  }\n}\n\nfragment IssueRelationTypeTimelineInfo on IssueRelationType {\n  id\n  name\n  inverseName\n  description\n}\n\nfragment IssueRelationTimelineInfoBase on IssueRelation {\n  type {\n    ...IssueRelationTypeTimelineInfo\n  }\n  initialType {\n    ...IssueRelationTypeTimelineInfo\n  }\n}\n\nfragment IncomingRelationTimelineInfo on IssueRelation {\n  id\n  ...IssueRelationTimelineInfoBase\n  issue {\n    ...IssueTimelineInfo\n  }\n}\n\nfragment OutgoingRelationTimelineInfo on IssueRelation {\n  id\n  ...IssueRelationTimelineInfoBase\n  relatedIssue {\n    ...IssueTimelineInfo\n  }\n}\n\nfragment IssueTimelineInfo on Issue {\n  ...DefaultIssueInfo\n}\n\nfragment IssuePriorityTimelineInfo on IssuePriority {\n  ...DefaultIssuePriorityInfo\n}\n\nfragment IssueStateTimelineInfo on IssueState {\n  ...DefaultIssueStateInfo\n}\n\nfragment IssueTemplateTimelineInfo on IssueTemplate {\n  name\n  description\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "fragment OpenIssueCount on Trackable {\n  openIssues: issues(filter: {state: {isOpen: {eq: true}}}) {\n    totalCount\n  }\n}\n\nfragment DefaultTrackableInfo on Trackable {\n  __typename\n  id\n  name\n  description\n}"
): (typeof documents)["fragment OpenIssueCount on Trackable {\n  openIssues: issues(filter: {state: {isOpen: {eq: true}}}) {\n    totalCount\n  }\n}\n\nfragment DefaultTrackableInfo on Trackable {\n  __typename\n  id\n  name\n  description\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "fragment DefaultUserInfo on User {\n  id\n  username\n  displayName\n  avatar\n}\n\nfragment CurrentUserInfo on User {\n  ...DefaultUserInfo\n  email\n  ... on GropiusUser {\n    isAdmin\n  }\n}"
): (typeof documents)["fragment DefaultUserInfo on User {\n  id\n  username\n  displayName\n  avatar\n}\n\nfragment CurrentUserInfo on User {\n  ...DefaultUserInfo\n  email\n  ... on GropiusUser {\n    isAdmin\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "fragment DefaultViewInfo on View {\n  id\n  name\n  description\n  filterByTemplate {\n    nodes {\n      id\n      name\n    }\n  }\n}\n\nfragment ViewGraphInfo on View {\n  ...DefaultViewInfo\n  relationLayouts {\n    nodes {\n      relation {\n        id\n      }\n      points {\n        x\n        y\n      }\n    }\n  }\n  relationPartnerLayouts {\n    nodes {\n      relationPartner {\n        id\n      }\n      pos {\n        x\n        y\n      }\n    }\n  }\n}"
): (typeof documents)["fragment DefaultViewInfo on View {\n  id\n  name\n  description\n  filterByTemplate {\n    nodes {\n      id\n      name\n    }\n  }\n}\n\nfragment ViewGraphInfo on View {\n  ...DefaultViewInfo\n  relationLayouts {\n    nodes {\n      relation {\n        id\n      }\n      points {\n        x\n        y\n      }\n    }\n  }\n  relationPartnerLayouts {\n    nodes {\n      relationPartner {\n        id\n      }\n      pos {\n        x\n        y\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getCurrentUser {\n        currentUser {\n            ...CurrentUserInfo\n        }\n\n        canCreateProjects: hasGlobalPermission(permission: CAN_CREATE_PROJECTS)\n        canCreateComponents: hasGlobalPermission(permission: CAN_CREATE_COMPONENTS)\n        canCreateIMSs: hasGlobalPermission(permission: CAN_CREATE_IMSS)\n        canCreateTemplates: hasGlobalPermission(permission: CAN_CREATE_TEMPLATES)\n    }\n"
): (typeof documents)["\n    query getCurrentUser {\n        currentUser {\n            ...CurrentUserInfo\n        }\n\n        canCreateProjects: hasGlobalPermission(permission: CAN_CREATE_PROJECTS)\n        canCreateComponents: hasGlobalPermission(permission: CAN_CREATE_COMPONENTS)\n        canCreateIMSs: hasGlobalPermission(permission: CAN_CREATE_IMSS)\n        canCreateTemplates: hasGlobalPermission(permission: CAN_CREATE_TEMPLATES)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query legalInformation {\n        legalInformation(orderBy: [{ field: PRIORITY, direction: ASC }]) {\n            nodes {\n                ...BaseLegalInformationInfo\n            }\n        }\n    }\n"
): (typeof documents)["\n    query legalInformation {\n        legalInformation(orderBy: [{ field: PRIORITY, direction: ASC }]) {\n            nodes {\n                ...BaseLegalInformationInfo\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getLegalInformation($id: ID!) {\n        node(id: $id) {\n            __typename\n            ... on LegalInformation {\n                ...DefaultLegalInformationInfo\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getLegalInformation($id: ID!) {\n        node(id: $id) {\n            __typename\n            ... on LegalInformation {\n                ...DefaultLegalInformationInfo\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getUser($id: ID!) {\n        node(id: $id) {\n            ... on User {\n                ...DefaultUserInfo\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getUser($id: ID!) {\n        node(id: $id) {\n            ... on User {\n                ...DefaultUserInfo\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getLegalInformationList($orderBy: [LegalInformationOrder!], $count: Int!, $skip: Int!) {\n        legalInformation(orderBy: $orderBy, first: $count, skip: $skip) {\n            nodes {\n                ...DefaultLegalInformationInfo\n            }\n            totalCount\n        }\n    }\n"
): (typeof documents)["\n    query getLegalInformationList($orderBy: [LegalInformationOrder!], $count: Int!, $skip: Int!) {\n        legalInformation(orderBy: $orderBy, first: $count, skip: $skip) {\n            nodes {\n                ...DefaultLegalInformationInfo\n            }\n            totalCount\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getFilteredLegalInformationList($query: String!, $count: Int!) {\n        searchLegalInformation(query: $query, first: $count) {\n            ...DefaultLegalInformationInfo\n        }\n    }\n"
): (typeof documents)["\n    query getFilteredLegalInformationList($query: String!, $count: Int!) {\n        searchLegalInformation(query: $query, first: $count) {\n            ...DefaultLegalInformationInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation deleteLegalInformation($id: ID!) {\n        deleteLegalInformation(input: { id: $id }) {\n            __typename\n        }\n    }\n"
): (typeof documents)["\n    mutation deleteLegalInformation($id: ID!) {\n        deleteLegalInformation(input: { id: $id }) {\n            __typename\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getGlobalPermissionList(\n        $orderBy: [GlobalPermissionOrder!]!\n        $count: Int!\n        $skip: Int!\n        $filter: GlobalPermissionFilterInput\n    ) {\n        globalPermissions(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n            nodes {\n                ...DefaultGlobalPermissionInfo\n            }\n            totalCount\n        }\n    }\n"
): (typeof documents)["\n    query getGlobalPermissionList(\n        $orderBy: [GlobalPermissionOrder!]!\n        $count: Int!\n        $skip: Int!\n        $filter: GlobalPermissionFilterInput\n    ) {\n        globalPermissions(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n            nodes {\n                ...DefaultGlobalPermissionInfo\n            }\n            totalCount\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getFilteredGlobalPermissionList($query: String!, $count: Int!, $filter: GlobalPermissionFilterInput!) {\n        searchGlobalPermissions(query: $query, first: $count, filter: $filter) {\n            ...DefaultGlobalPermissionInfo\n        }\n    }\n"
): (typeof documents)["\n    query getFilteredGlobalPermissionList($query: String!, $count: Int!, $filter: GlobalPermissionFilterInput!) {\n        searchGlobalPermissions(query: $query, first: $count, filter: $filter) {\n            ...DefaultGlobalPermissionInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation deleteGlobalPermission($globalPermission: ID!) {\n        deleteGlobalPermission(input: { id: $globalPermission }) {\n            __typename\n        }\n    }\n"
): (typeof documents)["\n    mutation deleteGlobalPermission($globalPermission: ID!) {\n        deleteGlobalPermission(input: { id: $globalPermission }) {\n            __typename\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation updateGlobalPermission($input: UpdateGlobalPermissionInput!) {\n        updateGlobalPermission(input: $input) {\n            __typename\n        }\n    }\n"
): (typeof documents)["\n    mutation updateGlobalPermission($input: UpdateGlobalPermissionInput!) {\n        updateGlobalPermission(input: $input) {\n            __typename\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation createGlobalPermission($input: CreateGlobalPermissionInput!) {\n        createGlobalPermission(input: $input) {\n            globalPermission {\n                id\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation createGlobalPermission($input: CreateGlobalPermissionInput!) {\n        createGlobalPermission(input: $input) {\n            globalPermission {\n                id\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getComponentDetails($id: ID!) {\n        node(id: $id) {\n            id\n            ... on Component {\n                name\n                description\n                issues(orderBy: [{ field: LAST_UPDATED_AT, direction: DESC }], first: 20) {\n                    nodes {\n                        ...IssueListItemInfo\n                    }\n                }\n                pinnedIssues {\n                    nodes {\n                        ...IssueListItemInfo\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getComponentDetails($id: ID!) {\n        node(id: $id) {\n            id\n            ... on Component {\n                name\n                description\n                issues(orderBy: [{ field: LAST_UPDATED_AT, direction: DESC }], first: 20) {\n                    nodes {\n                        ...IssueListItemInfo\n                    }\n                }\n                pinnedIssues {\n                    nodes {\n                        ...IssueListItemInfo\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getComponent($id: ID!) {\n        node(id: $id) {\n            id\n            ... on Component {\n                __typename\n                name\n                description\n                ...OpenIssueCount\n                createIssues: hasPermission(permission: CREATE_ISSUES)\n                manageLabels: hasPermission(permission: MANAGE_LABELS)\n                manageIssues: hasPermission(permission: MANAGE_ISSUES)\n                manageIMS: hasPermission(permission: MANAGE_IMS)\n                admin: hasPermission(permission: ADMIN)\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getComponent($id: ID!) {\n        node(id: $id) {\n            id\n            ... on Component {\n                __typename\n                name\n                description\n                ...OpenIssueCount\n                createIssues: hasPermission(permission: CREATE_ISSUES)\n                manageLabels: hasPermission(permission: MANAGE_LABELS)\n                manageIssues: hasPermission(permission: MANAGE_ISSUES)\n                manageIMS: hasPermission(permission: MANAGE_IMS)\n                admin: hasPermission(permission: ADMIN)\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getVersionedNode($id: ID!) {\n        node(id: $id) {\n            id\n            ... on Versioned {\n                version\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getVersionedNode($id: ID!) {\n        node(id: $id) {\n            id\n            ... on Versioned {\n                version\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getNamedNodeComponent($id: ID!) {\n        node(id: $id) {\n            id\n            ... on Named {\n                name\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getNamedNodeComponent($id: ID!) {\n        node(id: $id) {\n            id\n            ... on Named {\n                name\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation deleteComponent($id: ID!) {\n        deleteComponent(input: { id: $id }) {\n            __typename\n        }\n    }\n"
): (typeof documents)["\n    mutation deleteComponent($id: ID!) {\n        deleteComponent(input: { id: $id }) {\n            __typename\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getComponentGeneralDetails($id: ID!) {\n        node(id: $id) {\n            id\n            ... on Component {\n                name\n                description\n                repositoryURL\n                templatedFields {\n                    name\n                    value\n                }\n                template {\n                    templateFieldSpecifications {\n                        name\n                        value\n                    }\n                }\n                admin: hasPermission(permission: ADMIN)\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getComponentGeneralDetails($id: ID!) {\n        node(id: $id) {\n            id\n            ... on Component {\n                name\n                description\n                repositoryURL\n                templatedFields {\n                    name\n                    value\n                }\n                template {\n                    templateFieldSpecifications {\n                        name\n                        value\n                    }\n                }\n                admin: hasPermission(permission: ADMIN)\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation updateComponent($input: UpdateComponentInput!) {\n        updateComponent(input: $input) {\n            component {\n                id\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation updateComponent($input: UpdateComponentInput!) {\n        updateComponent(input: $input) {\n            component {\n                id\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getComponentTemplateDetails($id: ID!) {\n        node(id: $id) {\n            id\n            ... on Component {\n                template {\n                    id\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getComponentTemplateDetails($id: ID!) {\n        node(id: $id) {\n            id\n            ... on Component {\n                template {\n                    id\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getInterfaceSpecificationList(\n        $orderBy: [InterfaceSpecificationOrder!]!\n        $count: Int!\n        $skip: Int!\n        $component: ID!\n        $filter: InterfaceSpecificationFilterInput!\n    ) {\n        node(id: $component) {\n            ... on Component {\n                interfaceSpecifications(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n                    nodes {\n                        ...InterfaceSpecificationListItemInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getInterfaceSpecificationList(\n        $orderBy: [InterfaceSpecificationOrder!]!\n        $count: Int!\n        $skip: Int!\n        $component: ID!\n        $filter: InterfaceSpecificationFilterInput!\n    ) {\n        node(id: $component) {\n            ... on Component {\n                interfaceSpecifications(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n                    nodes {\n                        ...InterfaceSpecificationListItemInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getFilteredInterfaceSpecificationList(\n        $query: String!\n        $count: Int!\n        $filter: InterfaceSpecificationFilterInput!\n    ) {\n        searchInterfaceSpecifications(query: $query, first: $count, filter: $filter) {\n            ...InterfaceSpecificationListItemInfo\n        }\n    }\n"
): (typeof documents)["\n    query getFilteredInterfaceSpecificationList(\n        $query: String!\n        $count: Int!\n        $filter: InterfaceSpecificationFilterInput!\n    ) {\n        searchInterfaceSpecifications(query: $query, first: $count, filter: $filter) {\n            ...InterfaceSpecificationListItemInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchInterfaceSpecificationTemplatesForComponentInterfaces($query: String!, $count: Int!) {\n        searchInterfaceSpecificationTemplates(query: $query, first: $count) {\n            id\n            name\n            description\n        }\n    }\n"
): (typeof documents)["\n    query searchInterfaceSpecificationTemplatesForComponentInterfaces($query: String!, $count: Int!) {\n        searchInterfaceSpecificationTemplates(query: $query, first: $count) {\n            id\n            name\n            description\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getComponentPermissionList(\n        $orderBy: [ComponentPermissionOrder!]!\n        $count: Int!\n        $skip: Int!\n        $component: ID!\n        $filter: ComponentPermissionFilterInput!\n    ) {\n        node(id: $component) {\n            ... on Component {\n                permissions(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n                    nodes {\n                        ...DefaultComponentPermissionInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getComponentPermissionList(\n        $orderBy: [ComponentPermissionOrder!]!\n        $count: Int!\n        $skip: Int!\n        $component: ID!\n        $filter: ComponentPermissionFilterInput!\n    ) {\n        node(id: $component) {\n            ... on Component {\n                permissions(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n                    nodes {\n                        ...DefaultComponentPermissionInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getFilteredComponentPermissionList($query: String!, $count: Int!, $filter: ComponentPermissionFilterInput!) {\n        searchComponentPermissions(query: $query, first: $count, filter: $filter) {\n            ...DefaultComponentPermissionInfo\n        }\n    }\n"
): (typeof documents)["\n    query getFilteredComponentPermissionList($query: String!, $count: Int!, $filter: ComponentPermissionFilterInput!) {\n        searchComponentPermissions(query: $query, first: $count, filter: $filter) {\n            ...DefaultComponentPermissionInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation removeComponentPermissionFromComponent($component: ID!, $componentPermission: ID!) {\n        updateComponent(input: { id: $component, removedPermissions: [$componentPermission] }) {\n            __typename\n        }\n    }\n"
): (typeof documents)["\n    mutation removeComponentPermissionFromComponent($component: ID!, $componentPermission: ID!) {\n        updateComponent(input: { id: $component, removedPermissions: [$componentPermission] }) {\n            __typename\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation updateComponentPermission($input: UpdateComponentPermissionInput!) {\n        updateComponentPermission(input: $input) {\n            __typename\n        }\n    }\n"
): (typeof documents)["\n    mutation updateComponentPermission($input: UpdateComponentPermissionInput!) {\n        updateComponentPermission(input: $input) {\n            __typename\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation createComponentPermission($input: CreateComponentPermissionInput!) {\n        createComponentPermission(input: $input) {\n            componentPermission {\n                id\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation createComponentPermission($input: CreateComponentPermissionInput!) {\n        createComponentPermission(input: $input) {\n            componentPermission {\n                id\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation deleteInterfaceSpecification($id: ID!) {\n        deleteInterfaceSpecification(input: { id: $id }) {\n            __typename\n        }\n    }\n"
): (typeof documents)["\n    mutation deleteInterfaceSpecification($id: ID!) {\n        deleteInterfaceSpecification(input: { id: $id }) {\n            __typename\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getInterfaceSpecificationGeneralDetails($id: ID!) {\n        node(id: $id) {\n            id\n            ... on InterfaceSpecification {\n                name\n                description\n                templatedFields {\n                    name\n                    value\n                }\n                template {\n                    templateFieldSpecifications {\n                        name\n                        value\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getInterfaceSpecificationGeneralDetails($id: ID!) {\n        node(id: $id) {\n            id\n            ... on InterfaceSpecification {\n                name\n                description\n                templatedFields {\n                    name\n                    value\n                }\n                template {\n                    templateFieldSpecifications {\n                        name\n                        value\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation updateInterfaceSpecification($input: UpdateInterfaceSpecificationInput!) {\n        updateInterfaceSpecification(input: $input) {\n            interfaceSpecification {\n                id\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation updateInterfaceSpecification($input: UpdateInterfaceSpecificationInput!) {\n        updateInterfaceSpecification(input: $input) {\n            interfaceSpecification {\n                id\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation deleteInterfaceSpecificationVersion($id: ID!) {\n        deleteInterfaceSpecificationVersion(input: { id: $id }) {\n            __typename\n        }\n    }\n"
): (typeof documents)["\n    mutation deleteInterfaceSpecificationVersion($id: ID!) {\n        deleteInterfaceSpecificationVersion(input: { id: $id }) {\n            __typename\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getInterfaceSpecificationVersionGeneralDetails($id: ID!) {\n        node(id: $id) {\n            id\n            ... on InterfaceSpecificationVersion {\n                version\n                tags\n                templatedFields {\n                    name\n                    value\n                }\n                template {\n                    templateFieldSpecifications {\n                        name\n                        value\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getInterfaceSpecificationVersionGeneralDetails($id: ID!) {\n        node(id: $id) {\n            id\n            ... on InterfaceSpecificationVersion {\n                version\n                tags\n                templatedFields {\n                    name\n                    value\n                }\n                template {\n                    templateFieldSpecifications {\n                        name\n                        value\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation updateInterfaceSpecificationVersion($input: UpdateInterfaceSpecificationVersionInput!) {\n        updateInterfaceSpecificationVersion(input: $input) {\n            interfaceSpecificationVersion {\n                id\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation updateInterfaceSpecificationVersion($input: UpdateInterfaceSpecificationVersionInput!) {\n        updateInterfaceSpecificationVersion(input: $input) {\n            interfaceSpecificationVersion {\n                id\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getInterfaceSpecificationVersionList(\n        $orderBy: [InterfaceSpecificationVersionOrder!]!\n        $count: Int!\n        $skip: Int!\n        $interfaceSpecification: ID!\n    ) {\n        node(id: $interfaceSpecification) {\n            ... on InterfaceSpecification {\n                versions(orderBy: $orderBy, first: $count, skip: $skip) {\n                    nodes {\n                        ...InterfaceSpecificationVersionListItemInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getInterfaceSpecificationVersionList(\n        $orderBy: [InterfaceSpecificationVersionOrder!]!\n        $count: Int!\n        $skip: Int!\n        $interfaceSpecification: ID!\n    ) {\n        node(id: $interfaceSpecification) {\n            ... on InterfaceSpecification {\n                versions(orderBy: $orderBy, first: $count, skip: $skip) {\n                    nodes {\n                        ...InterfaceSpecificationVersionListItemInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getFilteredInterfaceSpecificationVersionList($query: String!, $count: Int!, $interfaceSpecification: ID!) {\n        searchInterfaceSpecificationVersions(\n            query: $query\n            first: $count\n            filter: { interfaceSpecification: { id: { eq: $interfaceSpecification } } }\n        ) {\n            ...InterfaceSpecificationVersionListItemInfo\n        }\n    }\n"
): (typeof documents)["\n    query getFilteredInterfaceSpecificationVersionList($query: String!, $count: Int!, $interfaceSpecification: ID!) {\n        searchInterfaceSpecificationVersions(\n            query: $query\n            first: $count\n            filter: { interfaceSpecification: { id: { eq: $interfaceSpecification } } }\n        ) {\n            ...InterfaceSpecificationVersionListItemInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation deleteComponentVersion($id: ID!) {\n        deleteComponentVersion(input: { id: $id }) {\n            __typename\n        }\n    }\n"
): (typeof documents)["\n    mutation deleteComponentVersion($id: ID!) {\n        deleteComponentVersion(input: { id: $id }) {\n            __typename\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getComponentVersionGeneralDetails($id: ID!) {\n        node(id: $id) {\n            id\n            ... on ComponentVersion {\n                version\n                tags\n                templatedFields {\n                    name\n                    value\n                }\n                template {\n                    templateFieldSpecifications {\n                        name\n                        value\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getComponentVersionGeneralDetails($id: ID!) {\n        node(id: $id) {\n            id\n            ... on ComponentVersion {\n                version\n                tags\n                templatedFields {\n                    name\n                    value\n                }\n                template {\n                    templateFieldSpecifications {\n                        name\n                        value\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation updateComponentVersion($input: UpdateComponentVersionInput!) {\n        updateComponentVersion(input: $input) {\n            componentVersion {\n                id\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation updateComponentVersion($input: UpdateComponentVersionInput!) {\n        updateComponentVersion(input: $input) {\n            componentVersion {\n                id\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getInterfaceDefinitionList(\n        $orderBy: [InterfaceDefinitionOrder!]!\n        $count: Int!\n        $skip: Int!\n        $componentVersion: ID!\n        $filter: InterfaceDefinitionFilterInput!\n    ) {\n        node(id: $componentVersion) {\n            ... on ComponentVersion {\n                interfaceDefinitions(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n                    nodes {\n                        ...DefaultInterfaceDefinitionInfo\n                        interfaceSpecificationVersion {\n                            id\n                            version\n                            interfaceSpecification {\n                                id\n                                name\n                                description\n                                template {\n                                    id\n                                    name\n                                    description\n                                }\n                            }\n                        }\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getInterfaceDefinitionList(\n        $orderBy: [InterfaceDefinitionOrder!]!\n        $count: Int!\n        $skip: Int!\n        $componentVersion: ID!\n        $filter: InterfaceDefinitionFilterInput!\n    ) {\n        node(id: $componentVersion) {\n            ... on ComponentVersion {\n                interfaceDefinitions(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n                    nodes {\n                        ...DefaultInterfaceDefinitionInfo\n                        interfaceSpecificationVersion {\n                            id\n                            version\n                            interfaceSpecification {\n                                id\n                                name\n                                description\n                                template {\n                                    id\n                                    name\n                                    description\n                                }\n                            }\n                        }\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getFilteredInterfaceDefinitionList(\n        $query: String!\n        $count: Int!\n        $specificationFilter: InterfaceSpecificationFilterInput!\n        $versionFilter: InterfaceSpecificationVersionFilterInput!\n        $definitionFilter: InterfaceDefinitionFilterInput!\n    ) {\n        searchInterfaceSpecifications(query: $query, first: $count, filter: $specificationFilter) {\n            id\n            name\n            description\n            template {\n                id\n                name\n                description\n            }\n            versions(filter: $versionFilter, first: $count) {\n                nodes {\n                    id\n                    version\n                    interfaceDefinitions(filter: $definitionFilter) {\n                        nodes {\n                            ...DefaultInterfaceDefinitionInfo\n                        }\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getFilteredInterfaceDefinitionList(\n        $query: String!\n        $count: Int!\n        $specificationFilter: InterfaceSpecificationFilterInput!\n        $versionFilter: InterfaceSpecificationVersionFilterInput!\n        $definitionFilter: InterfaceDefinitionFilterInput!\n    ) {\n        searchInterfaceSpecifications(query: $query, first: $count, filter: $specificationFilter) {\n            id\n            name\n            description\n            template {\n                id\n                name\n                description\n            }\n            versions(filter: $versionFilter, first: $count) {\n                nodes {\n                    id\n                    version\n                    interfaceDefinitions(filter: $definitionFilter) {\n                        nodes {\n                            ...DefaultInterfaceDefinitionInfo\n                        }\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchInterfaceSpecificationsForVersionInterfaces($query: String!, $count: Int!, $component: ID!) {\n        searchInterfaceSpecifications(query: $query, first: $count, filter: { component: { id: { eq: $component } } }) {\n            id\n            name\n            description\n        }\n    }\n"
): (typeof documents)["\n    query searchInterfaceSpecificationsForVersionInterfaces($query: String!, $count: Int!, $component: ID!) {\n        searchInterfaceSpecifications(query: $query, first: $count, filter: { component: { id: { eq: $component } } }) {\n            id\n            name\n            description\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchInterfaceSpecificationTemplatesForVersionInterfaces($query: String!, $count: Int!) {\n        searchInterfaceSpecificationTemplates(query: $query, first: $count) {\n            id\n            name\n            description\n        }\n    }\n"
): (typeof documents)["\n    query searchInterfaceSpecificationTemplatesForVersionInterfaces($query: String!, $count: Int!) {\n        searchInterfaceSpecificationTemplates(query: $query, first: $count) {\n            id\n            name\n            description\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation removeInterfaceSpecificationVersionFromComponentVersion(\n        $input: RemoveInterfaceSpecificationVersionFromComponentVersionInput!\n    ) {\n        removeInterfaceSpecificationVersionFromComponentVersion(input: $input) {\n            __typename\n        }\n    }\n"
): (typeof documents)["\n    mutation removeInterfaceSpecificationVersionFromComponentVersion(\n        $input: RemoveInterfaceSpecificationVersionFromComponentVersionInput!\n    ) {\n        removeInterfaceSpecificationVersionFromComponentVersion(input: $input) {\n            __typename\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getComponentVersionList($orderBy: [ComponentVersionOrder!]!, $count: Int!, $skip: Int!, $component: ID!) {\n        node(id: $component) {\n            ... on Component {\n                versions(orderBy: $orderBy, first: $count, skip: $skip) {\n                    nodes {\n                        ...ComponentVersionListItemInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getComponentVersionList($orderBy: [ComponentVersionOrder!]!, $count: Int!, $skip: Int!, $component: ID!) {\n        node(id: $component) {\n            ... on Component {\n                versions(orderBy: $orderBy, first: $count, skip: $skip) {\n                    nodes {\n                        ...ComponentVersionListItemInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getFilteredComponentVersionList($query: String!, $count: Int!, $component: ID!) {\n        searchComponentVersions(query: $query, first: $count, filter: { component: { id: { eq: $component } } }) {\n            ...ComponentVersionListItemInfo\n        }\n    }\n"
): (typeof documents)["\n    query getFilteredComponentVersionList($query: String!, $count: Int!, $component: ID!) {\n        searchComponentVersions(query: $query, first: $count, filter: { component: { id: { eq: $component } } }) {\n            ...ComponentVersionListItemInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getComponentList($orderBy: [ComponentOrder!]!, $count: Int!, $skip: Int!, $filter: ComponentFilterInput!) {\n        components(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n            nodes {\n                ...ComponentListItemInfo\n            }\n            totalCount\n        }\n    }\n"
): (typeof documents)["\n    query getComponentList($orderBy: [ComponentOrder!]!, $count: Int!, $skip: Int!, $filter: ComponentFilterInput!) {\n        components(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n            nodes {\n                ...ComponentListItemInfo\n            }\n            totalCount\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getFilteredComponentList($query: String!, $count: Int!, $filter: ComponentFilterInput!) {\n        searchComponents(query: $query, first: $count, filter: $filter) {\n            ...ComponentListItemInfo\n        }\n    }\n"
): (typeof documents)["\n    query getFilteredComponentList($query: String!, $count: Int!, $filter: ComponentFilterInput!) {\n        searchComponents(query: $query, first: $count, filter: $filter) {\n            ...ComponentListItemInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchComponentTemplates($query: String!, $count: Int!) {\n        searchComponentTemplates(query: $query, first: $count) {\n            id\n            name\n        }\n    }\n"
): (typeof documents)["\n    query searchComponentTemplates($query: String!, $count: Int!) {\n        searchComponentTemplates(query: $query, first: $count) {\n            id\n            name\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getParticipatingIssueList($orderBy: [IssueOrder!]!, $count: Int!, $skip: Int!, $filter: IssueFilterInput) {\n        currentUser {\n            participatedIssues(filter: $filter, orderBy: $orderBy, first: $count, skip: $skip) {\n                nodes {\n                    ...ParticipatingIssueListItemInfo\n                }\n                totalCount\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getParticipatingIssueList($orderBy: [IssueOrder!]!, $count: Int!, $skip: Int!, $filter: IssueFilterInput) {\n        currentUser {\n            participatedIssues(filter: $filter, orderBy: $orderBy, first: $count, skip: $skip) {\n                nodes {\n                    ...ParticipatingIssueListItemInfo\n                }\n                totalCount\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getParticipatingFilteredIssueList($query: String!, $count: Int!, $filter: IssueFilterInput) {\n        searchIssues(query: $query, first: $count, filter: $filter) {\n            ...ParticipatingIssueListItemInfo\n        }\n    }\n"
): (typeof documents)["\n    query getParticipatingFilteredIssueList($query: String!, $count: Int!, $filter: IssueFilterInput) {\n        searchIssues(query: $query, first: $count, filter: $filter) {\n            ...ParticipatingIssueListItemInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getIMSList($orderBy: [IMSOrder!]!, $count: Int!, $skip: Int!, $filter: IMSFilterInput!) {\n        imss(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n            nodes {\n                ...IMSListItemInfo\n            }\n            totalCount\n        }\n    }\n"
): (typeof documents)["\n    query getIMSList($orderBy: [IMSOrder!]!, $count: Int!, $skip: Int!, $filter: IMSFilterInput!) {\n        imss(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n            nodes {\n                ...IMSListItemInfo\n            }\n            totalCount\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getFilteredIMSList($query: String!, $count: Int!, $filter: IMSFilterInput) {\n        searchIMSs(query: $query, first: $count, filter: $filter) {\n            ...IMSListItemInfo\n        }\n    }\n"
): (typeof documents)["\n    query getFilteredIMSList($query: String!, $count: Int!, $filter: IMSFilterInput) {\n        searchIMSs(query: $query, first: $count, filter: $filter) {\n            ...IMSListItemInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchIMSTemplates($query: String!, $count: Int!) {\n        searchIMSTemplates(query: $query, first: $count) {\n            id\n            name\n        }\n    }\n"
): (typeof documents)["\n    query searchIMSTemplates($query: String!, $count: Int!) {\n        searchIMSTemplates(query: $query, first: $count) {\n            id\n            name\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getProjectList($orderBy: [ProjectOrder!]!, $count: Int!, $skip: Int!) {\n        projects(orderBy: $orderBy, first: $count, skip: $skip) {\n            nodes {\n                ...ProjectListItemInfo\n            }\n            totalCount\n        }\n    }\n"
): (typeof documents)["\n    query getProjectList($orderBy: [ProjectOrder!]!, $count: Int!, $skip: Int!) {\n        projects(orderBy: $orderBy, first: $count, skip: $skip) {\n            nodes {\n                ...ProjectListItemInfo\n            }\n            totalCount\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getFilteredProjectList($query: String!, $count: Int!) {\n        searchProjects(query: $query, first: $count) {\n            ...ProjectListItemInfo\n        }\n    }\n"
): (typeof documents)["\n    query getFilteredProjectList($query: String!, $count: Int!) {\n        searchProjects(query: $query, first: $count) {\n            ...ProjectListItemInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getIssueTemplateList($orderBy: [IssueTemplateOrder!]!, $count: Int!, $skip: Int!, $isDeprecated: Boolean!) {\n        issueTemplates(orderBy: $orderBy, first: $count, skip: $skip, filter: { isDeprecated: { eq: $isDeprecated } }) {\n            nodes {\n                ...DefaultIssueTemplateInfo\n            }\n            totalCount\n        }\n    }\n"
): (typeof documents)["\n    query getIssueTemplateList($orderBy: [IssueTemplateOrder!]!, $count: Int!, $skip: Int!, $isDeprecated: Boolean!) {\n        issueTemplates(orderBy: $orderBy, first: $count, skip: $skip, filter: { isDeprecated: { eq: $isDeprecated } }) {\n            nodes {\n                ...DefaultIssueTemplateInfo\n            }\n            totalCount\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getFilteredIssueTemplateList($query: String!, $count: Int!, $isDeprecated: Boolean!) {\n        searchIssueTemplates(query: $query, first: $count, filter: { isDeprecated: { eq: $isDeprecated } }) {\n            ...DefaultIssueTemplateInfo\n        }\n    }\n"
): (typeof documents)["\n    query getFilteredIssueTemplateList($query: String!, $count: Int!, $isDeprecated: Boolean!) {\n        searchIssueTemplates(query: $query, first: $count, filter: { isDeprecated: { eq: $isDeprecated } }) {\n            ...DefaultIssueTemplateInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getIssueTemplateDeprecationStatus($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on IssueTemplate {\n                isDeprecated\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getIssueTemplateDeprecationStatus($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on IssueTemplate {\n                isDeprecated\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation updateIssueTemplateDeprecationStatus($id: ID!, $isDeprecated: Boolean!) {\n        updateTemplateDeprecationStatus(input: { id: $id, isDeprecated: $isDeprecated }) {\n            template {\n                id\n                isDeprecated\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation updateIssueTemplateDeprecationStatus($id: ID!, $isDeprecated: Boolean!) {\n        updateTemplateDeprecationStatus(input: { id: $id, isDeprecated: $isDeprecated }) {\n            template {\n                id\n                isDeprecated\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getIssueTemplateGeneralDetails($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on IssueTemplate {\n                name\n                description\n                isDeprecated\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getIssueTemplateGeneralDetails($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on IssueTemplate {\n                name\n                description\n                isDeprecated\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation updateIssueTemplate($input: UpdateIssueTemplateInput!) {\n        updateIssueTemplate(input: $input) {\n            issueTemplate {\n                id\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation updateIssueTemplate($input: UpdateIssueTemplateInput!) {\n        updateIssueTemplate(input: $input) {\n            issueTemplate {\n                id\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getIssueTemplateIssueAttributes($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on IssueTemplate {\n                issueTypes {\n                    nodes {\n                        id\n                        name\n                        description\n                        iconPath\n                        partOf {\n                            totalCount\n                        }\n                    }\n                }\n                issuePriorities {\n                    nodes {\n                        id\n                        name\n                        description\n                        value\n                        iconPath\n                        partOf {\n                            totalCount\n                        }\n                    }\n                }\n                issueStates {\n                    nodes {\n                        id\n                        name\n                        description\n                        isOpen\n                        partOf {\n                            totalCount\n                        }\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getIssueTemplateIssueAttributes($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on IssueTemplate {\n                issueTypes {\n                    nodes {\n                        id\n                        name\n                        description\n                        iconPath\n                        partOf {\n                            totalCount\n                        }\n                    }\n                }\n                issuePriorities {\n                    nodes {\n                        id\n                        name\n                        description\n                        value\n                        iconPath\n                        partOf {\n                            totalCount\n                        }\n                    }\n                }\n                issueStates {\n                    nodes {\n                        id\n                        name\n                        description\n                        isOpen\n                        partOf {\n                            totalCount\n                        }\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getIssueTemplateLinkageAttributes($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on IssueTemplate {\n                assignmentTypes {\n                    nodes {\n                        id\n                        name\n                        description\n                        partOf {\n                            totalCount\n                        }\n                    }\n                }\n                relationTypes {\n                    nodes {\n                        id\n                        name\n                        description\n                        inverseName\n                        partOf {\n                            totalCount\n                        }\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getIssueTemplateLinkageAttributes($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on IssueTemplate {\n                assignmentTypes {\n                    nodes {\n                        id\n                        name\n                        description\n                        partOf {\n                            totalCount\n                        }\n                    }\n                }\n                relationTypes {\n                    nodes {\n                        id\n                        name\n                        description\n                        inverseName\n                        partOf {\n                            totalCount\n                        }\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getIssueTemplate($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on IssueTemplate {\n                name\n                description\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getIssueTemplate($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on IssueTemplate {\n                name\n                description\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getIssueTemplateFieldSpecifications($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on IssueTemplate {\n                templateFieldSpecifications {\n                    name\n                    value\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getIssueTemplateFieldSpecifications($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on IssueTemplate {\n                templateFieldSpecifications {\n                    name\n                    value\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getIMS($id: ID!) {\n        node(id: $id) {\n            __typename\n            ... on IMS {\n                name\n                description\n                syncTrackables: hasPermission(permission: SYNC_TRACKABLES)\n                admin: hasPermission(permission: ADMIN)\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getIMS($id: ID!) {\n        node(id: $id) {\n            __typename\n            ... on IMS {\n                name\n                description\n                syncTrackables: hasPermission(permission: SYNC_TRACKABLES)\n                admin: hasPermission(permission: ADMIN)\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getNamedNode($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on Named {\n                name\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getNamedNode($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on Named {\n                name\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation deleteIMS($id: ID!) {\n        deleteIMS(input: { id: $id }) {\n            __typename\n        }\n    }\n"
): (typeof documents)["\n    mutation deleteIMS($id: ID!) {\n        deleteIMS(input: { id: $id }) {\n            __typename\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getIMSGeneralDetails($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on IMS {\n                name\n                description\n                templatedFields {\n                    name\n                    value\n                }\n                template {\n                    templateFieldSpecifications {\n                        name\n                        value\n                    }\n                }\n                admin: hasPermission(permission: ADMIN)\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getIMSGeneralDetails($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on IMS {\n                name\n                description\n                templatedFields {\n                    name\n                    value\n                }\n                template {\n                    templateFieldSpecifications {\n                        name\n                        value\n                    }\n                }\n                admin: hasPermission(permission: ADMIN)\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation updateIMS($input: UpdateIMSInput!) {\n        updateIMS(input: $input) {\n            ims {\n                id\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation updateIMS($input: UpdateIMSInput!) {\n        updateIMS(input: $input) {\n            ims {\n                id\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getIMSPermissionList(\n        $orderBy: [IMSPermissionOrder!]!\n        $count: Int!\n        $skip: Int!\n        $ims: ID!\n        $filter: IMSPermissionFilterInput!\n    ) {\n        node(id: $ims) {\n            __typename\n            ... on IMS {\n                permissions(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n                    nodes {\n                        ...DefaultIMSPermissionInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getIMSPermissionList(\n        $orderBy: [IMSPermissionOrder!]!\n        $count: Int!\n        $skip: Int!\n        $ims: ID!\n        $filter: IMSPermissionFilterInput!\n    ) {\n        node(id: $ims) {\n            __typename\n            ... on IMS {\n                permissions(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n                    nodes {\n                        ...DefaultIMSPermissionInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getFilteredIMSPermissionList($query: String!, $count: Int!, $filter: IMSPermissionFilterInput!) {\n        searchIMSPermissions(query: $query, first: $count, filter: $filter) {\n            ...DefaultIMSPermissionInfo\n        }\n    }\n"
): (typeof documents)["\n    query getFilteredIMSPermissionList($query: String!, $count: Int!, $filter: IMSPermissionFilterInput!) {\n        searchIMSPermissions(query: $query, first: $count, filter: $filter) {\n            ...DefaultIMSPermissionInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation removeIMSPermissionFromIMS($ims: ID!, $imsPermission: ID!) {\n        updateIMS(input: { id: $ims, removedPermissions: [$imsPermission] }) {\n            __typename\n        }\n    }\n"
): (typeof documents)["\n    mutation removeIMSPermissionFromIMS($ims: ID!, $imsPermission: ID!) {\n        updateIMS(input: { id: $ims, removedPermissions: [$imsPermission] }) {\n            __typename\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation updateIMSPermission($input: UpdateIMSPermissionInput!) {\n        updateIMSPermission(input: $input) {\n            __typename\n        }\n    }\n"
): (typeof documents)["\n    mutation updateIMSPermission($input: UpdateIMSPermissionInput!) {\n        updateIMSPermission(input: $input) {\n            __typename\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation createIMSPermission($input: CreateIMSPermissionInput!) {\n        createIMSPermission(input: $input) {\n            imsPermission {\n                id\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation createIMSPermission($input: CreateIMSPermissionInput!) {\n        createIMSPermission(input: $input) {\n            imsPermission {\n                id\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation deleteIMSProject($id: ID!) {\n        deleteIMSProject(input: { id: $id }) {\n            __typename\n        }\n    }\n"
): (typeof documents)["\n    mutation deleteIMSProject($id: ID!) {\n        deleteIMSProject(input: { id: $id }) {\n            __typename\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getIMSProjectGeneralDetails($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on IMSProject {\n                name\n                description\n                templatedFields {\n                    name\n                    value\n                }\n                template {\n                    templateFieldSpecifications {\n                        name\n                        value\n                    }\n                }\n                ims {\n                    syncTrackables: hasPermission(permission: SYNC_TRACKABLES)\n                }\n                trackable {\n                    manageIMS: hasPermission(permission: MANAGE_IMS)\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getIMSProjectGeneralDetails($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on IMSProject {\n                name\n                description\n                templatedFields {\n                    name\n                    value\n                }\n                template {\n                    templateFieldSpecifications {\n                        name\n                        value\n                    }\n                }\n                ims {\n                    syncTrackables: hasPermission(permission: SYNC_TRACKABLES)\n                }\n                trackable {\n                    manageIMS: hasPermission(permission: MANAGE_IMS)\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation updateIMSProject($input: UpdateIMSProjectInput!) {\n        updateIMSProject(input: $input) {\n            imsProject {\n                id\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation updateIMSProject($input: UpdateIMSProjectInput!) {\n        updateIMSProject(input: $input) {\n            imsProject {\n                id\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getIMSProjectListFromIMS($orderBy: [IMSProjectOrder!]!, $count: Int!, $skip: Int!, $ims: ID!) {\n        node(id: $ims) {\n            __typename\n            ... on IMS {\n                projects(orderBy: $orderBy, first: $count, skip: $skip) {\n                    nodes {\n                        ...DefaultIMSProjectInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getIMSProjectListFromIMS($orderBy: [IMSProjectOrder!]!, $count: Int!, $skip: Int!, $ims: ID!) {\n        node(id: $ims) {\n            __typename\n            ... on IMS {\n                projects(orderBy: $orderBy, first: $count, skip: $skip) {\n                    nodes {\n                        ...DefaultIMSProjectInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getFilteredIMSProjectList($query: String!, $count: Int!, $filter: IMSProjectFilterInput!) {\n        searchIMSProjects(query: $query, first: $count, filter: $filter) {\n            ...DefaultIMSProjectInfo\n        }\n    }\n"
): (typeof documents)["\n    query getFilteredIMSProjectList($query: String!, $count: Int!, $filter: IMSProjectFilterInput!) {\n        searchIMSProjects(query: $query, first: $count, filter: $filter) {\n            ...DefaultIMSProjectInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getIssue($id: ID!) {\n        node(id: $id) {\n            __typename\n            ... on Issue {\n                id\n                title\n                createdBy {\n                    ...DefaultUserInfo\n                }\n                createdAt\n                lastUpdatedAt\n                timelineItems(orderBy: [{ field: CREATED_AT }]) {\n                    nodes {\n                        ...DefaultTimelineItemInfo\n                    }\n                }\n                artefacts {\n                    nodes {\n                        ...ArtefactTimelineInfo\n                    }\n                }\n                outgoingRelations {\n                    nodes {\n                        id\n                        ...OutgoingRelationTimelineInfo\n                    }\n                    totalCount\n                }\n                incomingRelations {\n                    nodes {\n                        id\n                        ...IncomingRelationTimelineInfo\n                    }\n                    totalCount\n                }\n                labels {\n                    nodes {\n                        ...DefaultLabelInfo\n                    }\n                }\n                affects {\n                    nodes {\n                        ...AffectedByIssueTimelineInfo\n                    }\n                }\n                assignments {\n                    nodes {\n                        ...AssignmentTimelineInfo\n                    }\n                }\n                type {\n                    ...DefaultIssueTypeInfo\n                }\n                state {\n                    ...DefaultIssueStateInfo\n                }\n                priority {\n                    ...DefaultIssuePriorityInfo\n                }\n                trackables {\n                    nodes {\n                        ...DefaultTrackableInfo\n                    }\n                }\n                templatedFields {\n                    name\n                    value\n                }\n                template {\n                    ...DefaultIssueTemplateInfo\n                }\n                manageIssues: hasPermission(permission: MANAGE_ISSUES)\n                comment: hasPermission(permission: COMMENT)\n                moderator: hasPermission(permission: MODERATOR)\n                exportIssues: hasPermission(permission: EXPORT_ISSUES)\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getIssue($id: ID!) {\n        node(id: $id) {\n            __typename\n            ... on Issue {\n                id\n                title\n                createdBy {\n                    ...DefaultUserInfo\n                }\n                createdAt\n                lastUpdatedAt\n                timelineItems(orderBy: [{ field: CREATED_AT }]) {\n                    nodes {\n                        ...DefaultTimelineItemInfo\n                    }\n                }\n                artefacts {\n                    nodes {\n                        ...ArtefactTimelineInfo\n                    }\n                }\n                outgoingRelations {\n                    nodes {\n                        id\n                        ...OutgoingRelationTimelineInfo\n                    }\n                    totalCount\n                }\n                incomingRelations {\n                    nodes {\n                        id\n                        ...IncomingRelationTimelineInfo\n                    }\n                    totalCount\n                }\n                labels {\n                    nodes {\n                        ...DefaultLabelInfo\n                    }\n                }\n                affects {\n                    nodes {\n                        ...AffectedByIssueTimelineInfo\n                    }\n                }\n                assignments {\n                    nodes {\n                        ...AssignmentTimelineInfo\n                    }\n                }\n                type {\n                    ...DefaultIssueTypeInfo\n                }\n                state {\n                    ...DefaultIssueStateInfo\n                }\n                priority {\n                    ...DefaultIssuePriorityInfo\n                }\n                trackables {\n                    nodes {\n                        ...DefaultTrackableInfo\n                    }\n                }\n                templatedFields {\n                    name\n                    value\n                }\n                template {\n                    ...DefaultIssueTemplateInfo\n                }\n                manageIssues: hasPermission(permission: MANAGE_ISSUES)\n                comment: hasPermission(permission: COMMENT)\n                moderator: hasPermission(permission: MODERATOR)\n                exportIssues: hasPermission(permission: EXPORT_ISSUES)\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation changeIssueType($issue: ID!, $type: ID!) {\n        changeIssueType(input: { issue: $issue, type: $type }) {\n            typeChangedEvent {\n                ...TypeChangedEventTimelineInfo\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation changeIssueType($issue: ID!, $type: ID!) {\n        changeIssueType(input: { issue: $issue, type: $type }) {\n            typeChangedEvent {\n                ...TypeChangedEventTimelineInfo\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation changeIssueState($issue: ID!, $state: ID!) {\n        changeIssueState(input: { issue: $issue, state: $state }) {\n            stateChangedEvent {\n                ...StateChangedEventTimelineInfo\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation changeIssueState($issue: ID!, $state: ID!) {\n        changeIssueState(input: { issue: $issue, state: $state }) {\n            stateChangedEvent {\n                ...StateChangedEventTimelineInfo\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation changeIssuePriority($issue: ID!, $priority: ID!) {\n        changeIssuePriority(input: { issue: $issue, priority: $priority }) {\n            priorityChangedEvent {\n                ...PriorityChangedEventTimelineInfo\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation changeIssuePriority($issue: ID!, $priority: ID!) {\n        changeIssuePriority(input: { issue: $issue, priority: $priority }) {\n            priorityChangedEvent {\n                ...PriorityChangedEventTimelineInfo\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation addLabelToIssue($issue: ID!, $label: ID!) {\n        addLabelToIssue(input: { issue: $issue, label: $label }) {\n            addedLabelEvent {\n                ...AddedLabelEventTimelineInfo\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation addLabelToIssue($issue: ID!, $label: ID!) {\n        addLabelToIssue(input: { issue: $issue, label: $label }) {\n            addedLabelEvent {\n                ...AddedLabelEventTimelineInfo\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation removeLabelFromIssue($issue: ID!, $label: ID!) {\n        removeLabelFromIssue(input: { issue: $issue, label: $label }) {\n            removedLabelEvent {\n                ...RemovedLabelEventTimelineInfo\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation removeLabelFromIssue($issue: ID!, $label: ID!) {\n        removeLabelFromIssue(input: { issue: $issue, label: $label }) {\n            removedLabelEvent {\n                ...RemovedLabelEventTimelineInfo\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation removeAssignment($id: ID!) {\n        removeAssignment(input: { assignment: $id }) {\n            removedAssignmentEvent {\n                ...RemovedAssignmentEventTimelineInfo\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation removeAssignment($id: ID!) {\n        removeAssignment(input: { assignment: $id }) {\n            removedAssignmentEvent {\n                ...RemovedAssignmentEventTimelineInfo\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation changeAssignmentType($assignment: ID!, $type: ID) {\n        changeAssignmentType(input: { assignment: $assignment, type: $type }) {\n            assignmentTypeChangedEvent {\n                ...AssignmentTypeChangedEventTimelineInfo\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation changeAssignmentType($assignment: ID!, $type: ID) {\n        changeAssignmentType(input: { assignment: $assignment, type: $type }) {\n            assignmentTypeChangedEvent {\n                ...AssignmentTypeChangedEventTimelineInfo\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation createAssignment($issue: ID!, $user: ID!) {\n        createAssignment(input: { issue: $issue, user: $user }) {\n            assignment {\n                ...AssignmentTimelineInfo\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation createAssignment($issue: ID!, $user: ID!) {\n        createAssignment(input: { issue: $issue, user: $user }) {\n            assignment {\n                ...AssignmentTimelineInfo\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation removeIssueRelation($id: ID!) {\n        removeIssueRelation(input: { issueRelation: $id }) {\n            removedOutgoingRelationEvent {\n                ...RemovedOutgoingRelationEventTimelineInfo\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation removeIssueRelation($id: ID!) {\n        removeIssueRelation(input: { issueRelation: $id }) {\n            removedOutgoingRelationEvent {\n                ...RemovedOutgoingRelationEventTimelineInfo\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation changeIssueRelationType($issueRelation: ID!, $type: ID) {\n        changeIssueRelationType(input: { issueRelation: $issueRelation, type: $type }) {\n            outgoingRelationTypeChangedEvent {\n                ...OutgoingRelationTypeChangedEventTimelineInfo\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation changeIssueRelationType($issueRelation: ID!, $type: ID) {\n        changeIssueRelationType(input: { issueRelation: $issueRelation, type: $type }) {\n            outgoingRelationTypeChangedEvent {\n                ...OutgoingRelationTypeChangedEventTimelineInfo\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation createIssueRelation($issue: ID!, $relatedIssue: ID!) {\n        createIssueRelation(input: { issue: $issue, relatedIssue: $relatedIssue }) {\n            issueRelation {\n                ...IssueRelationTimelineInfo\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation createIssueRelation($issue: ID!, $relatedIssue: ID!) {\n        createIssueRelation(input: { issue: $issue, relatedIssue: $relatedIssue }) {\n            issueRelation {\n                ...IssueRelationTimelineInfo\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation changeIssueTitle($id: ID!, $title: String!) {\n        changeIssueTitle(input: { issue: $id, title: $title }) {\n            titleChangedEvent {\n                ...TitleChangedEventTimelineInfo\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation changeIssueTitle($id: ID!, $title: String!) {\n        changeIssueTitle(input: { issue: $id, title: $title }) {\n            titleChangedEvent {\n                ...TitleChangedEventTimelineInfo\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation addAffectedEntityToIssue($issue: ID!, $affectedEntity: ID!) {\n        addAffectedEntityToIssue(input: { issue: $issue, affectedEntity: $affectedEntity }) {\n            addedAffectedEntityEvent {\n                ...AddedAffectedEntityEventTimelineInfo\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation addAffectedEntityToIssue($issue: ID!, $affectedEntity: ID!) {\n        addAffectedEntityToIssue(input: { issue: $issue, affectedEntity: $affectedEntity }) {\n            addedAffectedEntityEvent {\n                ...AddedAffectedEntityEventTimelineInfo\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation removeAffectedEntityFromIssue($issue: ID!, $affectedEntity: ID!) {\n        removeAffectedEntityFromIssue(input: { issue: $issue, affectedEntity: $affectedEntity }) {\n            removedAffectedEntityEvent {\n                ...RemovedAffectedEntityEventTimelineInfo\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation removeAffectedEntityFromIssue($issue: ID!, $affectedEntity: ID!) {\n        removeAffectedEntityFromIssue(input: { issue: $issue, affectedEntity: $affectedEntity }) {\n            removedAffectedEntityEvent {\n                ...RemovedAffectedEntityEventTimelineInfo\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation changeIssueTemplatedField($input: ChangeIssueTemplatedFieldInput!) {\n        changeIssueTemplatedField(input: $input) {\n            templatedFieldChangedEvent {\n                ...TemplatedFieldChangedEventTimelineInfo\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation changeIssueTemplatedField($input: ChangeIssueTemplatedFieldInput!) {\n        changeIssueTemplatedField(input: $input) {\n            templatedFieldChangedEvent {\n                ...TemplatedFieldChangedEventTimelineInfo\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation addIssueToTrackable($issue: ID!, $trackable: ID!) {\n        addIssueToTrackable(input: { issue: $issue, trackable: $trackable }) {\n            addedToTrackableEvent {\n                ...AddedToTrackableEventTimelineInfo\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation addIssueToTrackable($issue: ID!, $trackable: ID!) {\n        addIssueToTrackable(input: { issue: $issue, trackable: $trackable }) {\n            addedToTrackableEvent {\n                ...AddedToTrackableEventTimelineInfo\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation removeIssueFromTrackable($issue: ID!, $trackable: ID!) {\n        removeIssueFromTrackable(input: { issue: $issue, trackable: $trackable }) {\n            removedFromTrackableEvent {\n                ...RemovedFromTrackableEventTimelineInfo\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation removeIssueFromTrackable($issue: ID!, $trackable: ID!) {\n        removeIssueFromTrackable(input: { issue: $issue, trackable: $trackable }) {\n            removedFromTrackableEvent {\n                ...RemovedFromTrackableEventTimelineInfo\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getIssueList(\n        $orderBy: [IssueOrder!]!\n        $count: Int!\n        $skip: Int!\n        $filter: IssueFilterInput\n        $trackable: ID!\n    ) {\n        node(id: $trackable) {\n            __typename\n            ... on Trackable {\n                issues(filter: $filter, orderBy: $orderBy, first: $count, skip: $skip) {\n                    nodes {\n                        ...IssueListItemInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getIssueList(\n        $orderBy: [IssueOrder!]!\n        $count: Int!\n        $skip: Int!\n        $filter: IssueFilterInput\n        $trackable: ID!\n    ) {\n        node(id: $trackable) {\n            __typename\n            ... on Trackable {\n                issues(filter: $filter, orderBy: $orderBy, first: $count, skip: $skip) {\n                    nodes {\n                        ...IssueListItemInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getFilteredIssueList($query: String!, $count: Int!, $filter: IssueFilterInput) {\n        searchIssues(query: $query, first: $count, filter: $filter) {\n            ...IssueListItemInfo\n        }\n    }\n"
): (typeof documents)["\n    query getFilteredIssueList($query: String!, $count: Int!, $filter: IssueFilterInput) {\n        searchIssues(query: $query, first: $count, filter: $filter) {\n            ...IssueListItemInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getComponentIssueList(\n        $orderBy: [IssueOrder!]!\n        $count: Int!\n        $skip: Int!\n        $filter: IssueFilterInput\n        $project: ID!\n    ) {\n        node(id: $project) {\n            __typename\n            ... on Project {\n                componentIssues(filter: $filter, orderBy: $orderBy, first: $count, skip: $skip) {\n                    nodes {\n                        ...ProjectComponentIssueListItemInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getComponentIssueList(\n        $orderBy: [IssueOrder!]!\n        $count: Int!\n        $skip: Int!\n        $filter: IssueFilterInput\n        $project: ID!\n    ) {\n        node(id: $project) {\n            __typename\n            ... on Project {\n                componentIssues(filter: $filter, orderBy: $orderBy, first: $count, skip: $skip) {\n                    nodes {\n                        ...ProjectComponentIssueListItemInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getComponentFilteredIssueList($query: String!, $count: Int!, $project: ID!, $filter: IssueFilterInput!) {\n        searchIssues(\n            query: $query\n            first: $count\n            filter: {\n                and: [$filter]\n                trackables: { any: { isComponentAnd: { versions: { any: { partOfProject: $project } } } } }\n            }\n        ) {\n            ...ProjectComponentIssueListItemInfo\n        }\n    }\n"
): (typeof documents)["\n    query getComponentFilteredIssueList($query: String!, $count: Int!, $project: ID!, $filter: IssueFilterInput!) {\n        searchIssues(\n            query: $query\n            first: $count\n            filter: {\n                and: [$filter]\n                trackables: { any: { isComponentAnd: { versions: { any: { partOfProject: $project } } } } }\n            }\n        ) {\n            ...ProjectComponentIssueListItemInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getView($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on View {\n                name\n                filterByTemplate {\n                    nodes {\n                        id\n                    }\n                }\n                relationLayouts {\n                    nodes {\n                        relation {\n                            id\n                        }\n                        points {\n                            x\n                            y\n                        }\n                    }\n                }\n                relationPartnerLayouts {\n                    nodes {\n                        relationPartner {\n                            id\n                        }\n                        pos {\n                            x\n                            y\n                        }\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getView($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on View {\n                name\n                filterByTemplate {\n                    nodes {\n                        id\n                    }\n                }\n                relationLayouts {\n                    nodes {\n                        relation {\n                            id\n                        }\n                        points {\n                            x\n                            y\n                        }\n                    }\n                }\n                relationPartnerLayouts {\n                    nodes {\n                        relationPartner {\n                            id\n                        }\n                        pos {\n                            x\n                            y\n                        }\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation addComponentVersionToProject($project: ID!, $componentVersion: ID!) {\n        addComponentVersionToProject(input: { componentVersion: $componentVersion, project: $project }) {\n            componentVersion {\n                component {\n                    template {\n                        id\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation addComponentVersionToProject($project: ID!, $componentVersion: ID!) {\n        addComponentVersionToProject(input: { componentVersion: $componentVersion, project: $project }) {\n            componentVersion {\n                component {\n                    template {\n                        id\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation removeComponentVersionFromProject($project: ID!, $componentVersion: ID!) {\n        removeComponentVersionFromProject(input: { componentVersion: $componentVersion, project: $project }) {\n            project {\n                id\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation removeComponentVersionFromProject($project: ID!, $componentVersion: ID!) {\n        removeComponentVersionFromProject(input: { componentVersion: $componentVersion, project: $project }) {\n            project {\n                id\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation createRelation($start: ID!, $end: ID!, $template: ID!) {\n        createRelation(input: { start: $start, end: $end, template: $template, templatedFields: [] }) {\n            relation {\n                id\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation createRelation($start: ID!, $end: ID!, $template: ID!) {\n        createRelation(input: { start: $start, end: $end, template: $template, templatedFields: [] }) {\n            relation {\n                id\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation deleteRelation($id: ID!) {\n        deleteRelation(input: { id: $id }) {\n            id\n        }\n    }\n"
): (typeof documents)["\n    mutation deleteRelation($id: ID!) {\n        deleteRelation(input: { id: $id }) {\n            id\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation updateView($input: UpdateViewInput!) {\n        updateView(input: $input) {\n            __typename\n        }\n    }\n"
): (typeof documents)["\n    mutation updateView($input: UpdateViewInput!) {\n        updateView(input: $input) {\n            __typename\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation updateProject($input: UpdateProjectInput!) {\n        updateProject(input: $input) {\n            project {\n                id\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation updateProject($input: UpdateProjectInput!) {\n        updateProject(input: $input) {\n            project {\n                id\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getProjectGraph($project: ID!) {\n        node(id: $project) {\n            __typename\n            ... on Project {\n                ...GraphInfo\n                relationLayouts {\n                    nodes {\n                        relation {\n                            id\n                        }\n                        points {\n                            x\n                            y\n                        }\n                    }\n                }\n                relationPartnerLayouts {\n                    nodes {\n                        relationPartner {\n                            id\n                        }\n                        pos {\n                            x\n                            y\n                        }\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getProjectGraph($project: ID!) {\n        node(id: $project) {\n            __typename\n            ... on Project {\n                ...GraphInfo\n                relationLayouts {\n                    nodes {\n                        relation {\n                            id\n                        }\n                        points {\n                            x\n                            y\n                        }\n                    }\n                }\n                relationPartnerLayouts {\n                    nodes {\n                        relationPartner {\n                            id\n                        }\n                        pos {\n                            x\n                            y\n                        }\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getProject($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on Project {\n                __typename\n                name\n                description\n                ...OpenIssueCount\n                createIssues: hasPermission(permission: CREATE_ISSUES)\n                manageLabels: hasPermission(permission: MANAGE_LABELS)\n                manageComponents: hasPermission(permission: MANAGE_COMPONENTS)\n                manageIssues: hasPermission(permission: MANAGE_ISSUES)\n                manageIMS: hasPermission(permission: MANAGE_IMS)\n                manageViews: hasPermission(permission: MANAGE_VIEWS)\n                admin: hasPermission(permission: ADMIN)\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getProject($id: ID!) {\n        node(id: $id) {\n            __typename\n            id\n            ... on Project {\n                __typename\n                name\n                description\n                ...OpenIssueCount\n                createIssues: hasPermission(permission: CREATE_ISSUES)\n                manageLabels: hasPermission(permission: MANAGE_LABELS)\n                manageComponents: hasPermission(permission: MANAGE_COMPONENTS)\n                manageIssues: hasPermission(permission: MANAGE_ISSUES)\n                manageIMS: hasPermission(permission: MANAGE_IMS)\n                manageViews: hasPermission(permission: MANAGE_VIEWS)\n                admin: hasPermission(permission: ADMIN)\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation deleteProject($id: ID!) {\n        deleteProject(input: { id: $id }) {\n            __typename\n        }\n    }\n"
): (typeof documents)["\n    mutation deleteProject($id: ID!) {\n        deleteProject(input: { id: $id }) {\n            __typename\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getProjectGeneralDetails($id: ID!) {\n        node(id: $id) {\n            id\n            ... on Project {\n                name\n                description\n                repositoryURL\n                defaultView {\n                    id\n                }\n                admin: hasPermission(permission: ADMIN)\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getProjectGeneralDetails($id: ID!) {\n        node(id: $id) {\n            id\n            ... on Project {\n                name\n                description\n                repositoryURL\n                defaultView {\n                    id\n                }\n                admin: hasPermission(permission: ADMIN)\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getProjectPermissionList(\n        $orderBy: [ProjectPermissionOrder!]!\n        $count: Int!\n        $skip: Int!\n        $project: ID!\n        $filter: ProjectPermissionFilterInput!\n    ) {\n        node(id: $project) {\n            ... on Project {\n                permissions(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n                    nodes {\n                        ...DefaultProjectPermissionInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getProjectPermissionList(\n        $orderBy: [ProjectPermissionOrder!]!\n        $count: Int!\n        $skip: Int!\n        $project: ID!\n        $filter: ProjectPermissionFilterInput!\n    ) {\n        node(id: $project) {\n            ... on Project {\n                permissions(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n                    nodes {\n                        ...DefaultProjectPermissionInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getFilteredProjectPermissionList($query: String!, $count: Int!, $filter: ProjectPermissionFilterInput!) {\n        searchProjectPermissions(query: $query, first: $count, filter: $filter) {\n            ...DefaultProjectPermissionInfo\n        }\n    }\n"
): (typeof documents)["\n    query getFilteredProjectPermissionList($query: String!, $count: Int!, $filter: ProjectPermissionFilterInput!) {\n        searchProjectPermissions(query: $query, first: $count, filter: $filter) {\n            ...DefaultProjectPermissionInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation removeProjectPermissionFromProject($project: ID!, $projectPermission: ID!) {\n        updateProject(input: { id: $project, removedPermissions: [$projectPermission] }) {\n            __typename\n        }\n    }\n"
): (typeof documents)["\n    mutation removeProjectPermissionFromProject($project: ID!, $projectPermission: ID!) {\n        updateProject(input: { id: $project, removedPermissions: [$projectPermission] }) {\n            __typename\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation updateProjectPermission($input: UpdateProjectPermissionInput!) {\n        updateProjectPermission(input: $input) {\n            __typename\n        }\n    }\n"
): (typeof documents)["\n    mutation updateProjectPermission($input: UpdateProjectPermissionInput!) {\n        updateProjectPermission(input: $input) {\n            __typename\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation createProjectPermission($input: CreateProjectPermissionInput!) {\n        createProjectPermission(input: $input) {\n            projectPermission {\n                id\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation createProjectPermission($input: CreateProjectPermissionInput!) {\n        createProjectPermission(input: $input) {\n            projectPermission {\n                id\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getViewList($orderBy: [ViewOrder!]!, $count: Int!, $skip: Int!, $project: ID!, $filter: ViewFilterInput!) {\n        node(id: $project) {\n            ... on Project {\n                views(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n                    nodes {\n                        ...DefaultViewInfo\n                        filterByTemplate {\n                            nodes {\n                                description\n                            }\n                        }\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getViewList($orderBy: [ViewOrder!]!, $count: Int!, $skip: Int!, $project: ID!, $filter: ViewFilterInput!) {\n        node(id: $project) {\n            ... on Project {\n                views(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n                    nodes {\n                        ...DefaultViewInfo\n                        filterByTemplate {\n                            nodes {\n                                description\n                            }\n                        }\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getFilteredViewList($query: String!, $count: Int!, $filter: ViewFilterInput!) {\n        searchViews(query: $query, first: $count, filter: $filter) {\n            ...DefaultViewInfo\n            filterByTemplate {\n                nodes {\n                    description\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getFilteredViewList($query: String!, $count: Int!, $filter: ViewFilterInput!) {\n        searchViews(query: $query, first: $count, filter: $filter) {\n            ...DefaultViewInfo\n            filterByTemplate {\n                nodes {\n                    description\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query searchComponentTemplatesForViews($query: String!, $count: Int!) {\n        searchComponentTemplates(query: $query, first: $count) {\n            id\n            name\n            description\n        }\n    }\n"
): (typeof documents)["\n    query searchComponentTemplatesForViews($query: String!, $count: Int!) {\n        searchComponentTemplates(query: $query, first: $count) {\n            id\n            name\n            description\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getProjectComponentTemplates($project: ID!) {\n        node(id: $project) {\n            ... on Project {\n                components {\n                    nodes {\n                        component {\n                            template {\n                                name\n                                id\n                            }\n                        }\n                    }\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getProjectComponentTemplates($project: ID!) {\n        node(id: $project) {\n            ... on Project {\n                components {\n                    nodes {\n                        component {\n                            template {\n                                name\n                                id\n                            }\n                        }\n                    }\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation deleteView($id: ID!) {\n        deleteView(input: { id: $id }) {\n            __typename\n        }\n    }\n"
): (typeof documents)["\n    mutation deleteView($id: ID!) {\n        deleteView(input: { id: $id }) {\n            __typename\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getIMSProjectListFromTrackable(\n        $orderBy: [IMSProjectOrder!]!\n        $count: Int!\n        $skip: Int!\n        $trackable: ID!\n        $filter: IMSProjectFilterInput!\n    ) {\n        node(id: $trackable) {\n            __typename\n            ... on Trackable {\n                syncsTo(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n                    nodes {\n                        ...DefaultIMSProjectInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getIMSProjectListFromTrackable(\n        $orderBy: [IMSProjectOrder!]!\n        $count: Int!\n        $skip: Int!\n        $trackable: ID!\n        $filter: IMSProjectFilterInput!\n    ) {\n        node(id: $trackable) {\n            __typename\n            ... on Trackable {\n                syncsTo(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {\n                    nodes {\n                        ...DefaultIMSProjectInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getLabelList($orderBy: [LabelOrder!]!, $count: Int!, $skip: Int!, $trackable: ID!) {\n        node(id: $trackable) {\n            __typename\n            ... on Trackable {\n                labels(orderBy: $orderBy, first: $count, skip: $skip) {\n                    nodes {\n                        ...DefaultLabelInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n"
): (typeof documents)["\n    query getLabelList($orderBy: [LabelOrder!]!, $count: Int!, $skip: Int!, $trackable: ID!) {\n        node(id: $trackable) {\n            __typename\n            ... on Trackable {\n                labels(orderBy: $orderBy, first: $count, skip: $skip) {\n                    nodes {\n                        ...DefaultLabelInfo\n                    }\n                    totalCount\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    query getFilteredLabelList($query: String!, $count: Int!, $trackable: ID!) {\n        searchLabels(query: $query, first: $count, filter: { trackables: { any: { id: { eq: $trackable } } } }) {\n            ...DefaultLabelInfo\n        }\n    }\n"
): (typeof documents)["\n    query getFilteredLabelList($query: String!, $count: Int!, $trackable: ID!) {\n        searchLabels(query: $query, first: $count, filter: { trackables: { any: { id: { eq: $trackable } } } }) {\n            ...DefaultLabelInfo\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "\n    mutation removeLabelFromTrackable($trackable: ID!, $label: ID!) {\n        removeLabelFromTrackable(input: { label: $label, trackable: $trackable }) {\n            __typename\n        }\n    }\n"
): (typeof documents)["\n    mutation removeLabelFromTrackable($trackable: ID!, $label: ID!) {\n        removeLabelFromTrackable(input: { label: $label, trackable: $trackable }) {\n            __typename\n        }\n    }\n"];

export function graphql(source: string) {
    return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
    TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
