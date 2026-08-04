/** Fields a list of AffectedByIssue can be sorted by */
export const AffectedByIssueOrderField = {
    /** Order by id */
    Id: "ID"
} as const;

export type AffectedByIssueOrderField = (typeof AffectedByIssueOrderField)[keyof typeof AffectedByIssueOrderField];
/** Fields a list of AggregatedIssue can be sorted by */
export const AggregatedIssueOrderField = {
    /** Order by count */
    Count: "COUNT",
    /** Order by id */
    Id: "ID"
} as const;

export type AggregatedIssueOrderField = (typeof AggregatedIssueOrderField)[keyof typeof AggregatedIssueOrderField];
/** Fields a list of AggregatedIssueRelation can be sorted by */
export const AggregatedIssueRelationOrderField = {
    /** Order by id */
    Id: "ID"
} as const;

export type AggregatedIssueRelationOrderField =
    (typeof AggregatedIssueRelationOrderField)[keyof typeof AggregatedIssueRelationOrderField];
/** Non global permission entries */
export const AllPermissionEntry = {
    /**
     * Allows to add the Component to Projects
     * Note: this should be handled very carefully, as adding a Component to a Project gives
     * all users with READ access to the Project READ access to the Component
     */
    AddToProjects: "ADD_TO_PROJECTS",
    /** Grants all other permissions on the Node except READ. */
    Admin: "ADMIN",
    /**
     * Allows affecting entities part of this Trackable with any Issues.
     * Affectable entitites include
     *   - the Trackable itself
     *   - in case the Trackable is a Component
     *     - InterfaceSpecifications, their InterfaceSpecificationVersions and their InterfaceParts of the Component (not inherited ones)
     *     - Interfaces on the Component
     *     - ComponentVersions of the Component
     */
    AffectEntitiesWithIssues: "AFFECT_ENTITIES_WITH_ISSUES",
    /**
     * Allows to create Comments on Issues on this Trackable.
     * Also allows editing of your own Comments.
     */
    Comment: "COMMENT",
    /**
     * Allows to create new Issues on the Trackable.
     * This includes adding Issues from other Trackables.
     */
    CreateIssues: "CREATE_ISSUES",
    /** Allows adding Issues on this Trackable to other Trackables. */
    ExportIssues: "EXPORT_ISSUES",
    /** Allows adding Labels on this Trackable to other Trackables. */
    ExportLabels: "EXPORT_LABELS",
    /** Allows to add, remove, and update Artefacts on this Trackable. */
    ManageArtefacts: "MANAGE_ARTEFACTS",
    /** Allows to add / remove ComponentVersions to / from this Project. */
    ManageComponents: "MANAGE_COMPONENTS",
    /**
     * Allows to add, remove, and update IMSProjects on this Trackable.
     * Note: for adding, `IMSPermissionEntry.SYNC_TRACKABLES` is required additionally
     */
    ManageIms: "MANAGE_IMS",
    /**
     * Allows to manage issues.
     * This includes `CREATE_ISSUES` and `COMMENT`.
     * This does NOT include `LINK_TO_ISSUES` and `LINK_FROM_ISSUES`.
     * Additionaly includes
     *   - change the Template
     *   - add / remove Labels
     *   - add / remove Artefacts
     *   - change any field on the Issue (title, ...)
     *   - change templated fields
     * In contrast to `MODERATOR`, this does not allow editing / removing Comments of other users
     */
    ManageIssues: "MANAGE_ISSUES",
    /**
     * Allows to add, remove, and update Labels on this Trackable.
     * Also allows to delete a Label, but only if it is allowed on all Trackable the Label is on.
     */
    ManageLabels: "MANAGE_LABELS",
    /** Allows to manage the views of this Project. */
    ManageViews: "MANAGE_VIEWS",
    /**
     * Allows to moderate Issues on this Trackable.
     * This allows everything `MANAGE_ISSUES` allows.
     * Additionally, it allows editing and deleting Comments of other Users
     */
    Moderator: "MODERATOR",
    /**
     * Allows to read the Node (obtain it via the API) and to read certain related Nodes.
     * See documentation for specific Node for the specific conditions.
     */
    Read: "READ",
    /**
     * Allows to create Relations with a version of this Component or an Interface of this Component
     * as start.
     * Note: as these Relations cannot cause new Interfaces on this Component, this can be granted
     * more permissively compared to `RELATE_TO_COMPONENT`.
     */
    RelateFromComponent: "RELATE_FROM_COMPONENT",
    /** Allows to create IMSProjects with this IMS. */
    SyncTrackables: "SYNC_TRACKABLES"
} as const;

export type AllPermissionEntry = (typeof AllPermissionEntry)[keyof typeof AllPermissionEntry];
/** Fields a list of Artefact can be sorted by */
export const ArtefactOrderField = {
    /** Order by createdAt */
    CreatedAt: "CREATED_AT",
    /** Order by file */
    File: "FILE",
    /** Order by from */
    From: "FROM",
    /** Order by id */
    Id: "ID",
    /** Order by lastModifiedAt */
    LastModifiedAt: "LAST_MODIFIED_AT",
    /** Order by to */
    To: "TO",
    /** Order by version */
    Version: "VERSION"
} as const;

export type ArtefactOrderField = (typeof ArtefactOrderField)[keyof typeof ArtefactOrderField];
/** Fields a list of ArtefactTemplate can be sorted by */
export const ArtefactTemplateOrderField = {
    /** Order by id */
    Id: "ID",
    /** Order by name */
    Name: "NAME"
} as const;

export type ArtefactTemplateOrderField = (typeof ArtefactTemplateOrderField)[keyof typeof ArtefactTemplateOrderField];
/** Fields a list of Assignment can be sorted by */
export const AssignmentOrderField = {
    /** Order by createdAt */
    CreatedAt: "CREATED_AT",
    /** Order by id */
    Id: "ID",
    /** Order by lastModifiedAt */
    LastModifiedAt: "LAST_MODIFIED_AT"
} as const;

export type AssignmentOrderField = (typeof AssignmentOrderField)[keyof typeof AssignmentOrderField];
/** Fields a list of AssignmentType can be sorted by */
export const AssignmentTypeOrderField = {
    /** Order by id */
    Id: "ID",
    /** Order by name */
    Name: "NAME"
} as const;

export type AssignmentTypeOrderField = (typeof AssignmentTypeOrderField)[keyof typeof AssignmentTypeOrderField];
/** Fields a list of AuditedNode can be sorted by */
export const AuditedNodeOrderField = {
    /** Order by createdAt */
    CreatedAt: "CREATED_AT",
    /** Order by id */
    Id: "ID",
    /** Order by lastModifiedAt */
    LastModifiedAt: "LAST_MODIFIED_AT"
} as const;

export type AuditedNodeOrderField = (typeof AuditedNodeOrderField)[keyof typeof AuditedNodeOrderField];
/** Fields a list of BasePermission can be sorted by */
export const BasePermissionOrderField = {
    /** Order by allUsers */
    AllUsers: "ALL_USERS",
    /** Order by id */
    Id: "ID",
    /** Order by name */
    Name: "NAME"
} as const;

export type BasePermissionOrderField = (typeof BasePermissionOrderField)[keyof typeof BasePermissionOrderField];
/** Fields a list of Component can be sorted by */
export const ComponentOrderField = {
    /** Order by id */
    Id: "ID",
    /** Order by name */
    Name: "NAME",
    /** Order by template_id */
    TemplateId: "TEMPLATE_ID",
    /** Order by template_name */
    TemplateName: "TEMPLATE_NAME"
} as const;

export type ComponentOrderField = (typeof ComponentOrderField)[keyof typeof ComponentOrderField];
/** ComponentPermission entry enum type. */
export const ComponentPermissionEntry = {
    /**
     * Allows to add the Component to Projects
     * Note: this should be handled very carefully, as adding a Component to a Project gives
     * all users with READ access to the Project READ access to the Component
     */
    AddToProjects: "ADD_TO_PROJECTS",
    /** Grants all other permissions on the Node except READ. */
    Admin: "ADMIN",
    /**
     * Allows affecting entities part of this Trackable with any Issues.
     * Affectable entitites include
     *   - the Trackable itself
     *   - in case the Trackable is a Component
     *     - InterfaceSpecifications, their InterfaceSpecificationVersions and their InterfaceParts of the Component (not inherited ones)
     *     - Interfaces on the Component
     *     - ComponentVersions of the Component
     */
    AffectEntitiesWithIssues: "AFFECT_ENTITIES_WITH_ISSUES",
    /**
     * Allows to create Comments on Issues on this Trackable.
     * Also allows editing of your own Comments.
     */
    Comment: "COMMENT",
    /**
     * Allows to create new Issues on the Trackable.
     * This includes adding Issues from other Trackables.
     */
    CreateIssues: "CREATE_ISSUES",
    /** Allows adding Issues on this Trackable to other Trackables. */
    ExportIssues: "EXPORT_ISSUES",
    /** Allows adding Labels on this Trackable to other Trackables. */
    ExportLabels: "EXPORT_LABELS",
    /** Allows to add, remove, and update Artefacts on this Trackable. */
    ManageArtefacts: "MANAGE_ARTEFACTS",
    /**
     * Allows to add, remove, and update IMSProjects on this Trackable.
     * Note: for adding, `IMSPermissionEntry.SYNC_TRACKABLES` is required additionally
     */
    ManageIms: "MANAGE_IMS",
    /**
     * Allows to manage issues.
     * This includes `CREATE_ISSUES` and `COMMENT`.
     * This does NOT include `LINK_TO_ISSUES` and `LINK_FROM_ISSUES`.
     * Additionaly includes
     *   - change the Template
     *   - add / remove Labels
     *   - add / remove Artefacts
     *   - change any field on the Issue (title, ...)
     *   - change templated fields
     * In contrast to `MODERATOR`, this does not allow editing / removing Comments of other users
     */
    ManageIssues: "MANAGE_ISSUES",
    /**
     * Allows to add, remove, and update Labels on this Trackable.
     * Also allows to delete a Label, but only if it is allowed on all Trackable the Label is on.
     */
    ManageLabels: "MANAGE_LABELS",
    /**
     * Allows to moderate Issues on this Trackable.
     * This allows everything `MANAGE_ISSUES` allows.
     * Additionally, it allows editing and deleting Comments of other Users
     */
    Moderator: "MODERATOR",
    /**
     * Allows to read the Node (obtain it via the API) and to read certain related Nodes.
     * See documentation for specific Node for the specific conditions.
     */
    Read: "READ",
    /**
     * Allows to create Relations with a version of this Component or an Interface of this Component
     * as start.
     * Note: as these Relations cannot cause new Interfaces on this Component, this can be granted
     * more permissively compared to `RELATE_TO_COMPONENT`.
     */
    RelateFromComponent: "RELATE_FROM_COMPONENT"
} as const;

export type ComponentPermissionEntry = (typeof ComponentPermissionEntry)[keyof typeof ComponentPermissionEntry];
/** Fields a list of ComponentPermission can be sorted by */
export const ComponentPermissionOrderField = {
    /** Order by allUsers */
    AllUsers: "ALL_USERS",
    /** Order by id */
    Id: "ID",
    /** Order by name */
    Name: "NAME"
} as const;

export type ComponentPermissionOrderField =
    (typeof ComponentPermissionOrderField)[keyof typeof ComponentPermissionOrderField];
/** Fields a list of ComponentTemplate can be sorted by */
export const ComponentTemplateOrderField = {
    /** Order by id */
    Id: "ID",
    /** Order by name */
    Name: "NAME"
} as const;

export type ComponentTemplateOrderField =
    (typeof ComponentTemplateOrderField)[keyof typeof ComponentTemplateOrderField];
/** Fields a list of ComponentVersion can be sorted by */
export const ComponentVersionOrderField = {
    /** Order by id */
    Id: "ID",
    /** Order by template_id */
    TemplateId: "TEMPLATE_ID",
    /** Order by template_name */
    TemplateName: "TEMPLATE_NAME",
    /** Order by version */
    Version: "VERSION"
} as const;

export type ComponentVersionOrderField = (typeof ComponentVersionOrderField)[keyof typeof ComponentVersionOrderField];
/** Fields a list of GlobalPermission can be sorted by */
export const GlobalPermissionOrderField = {
    /** Order by allUsers */
    AllUsers: "ALL_USERS",
    /** Order by id */
    Id: "ID",
    /** Order by name */
    Name: "NAME"
} as const;

export type GlobalPermissionOrderField = (typeof GlobalPermissionOrderField)[keyof typeof GlobalPermissionOrderField];
/** Fields a list of GropiusUser can be sorted by */
export const GropiusUserOrderField = {
    /** Order by displayName */
    DisplayName: "DISPLAY_NAME",
    /** Order by email */
    Email: "EMAIL",
    /** Order by id */
    Id: "ID",
    /** Order by username */
    Username: "USERNAME"
} as const;

export type GropiusUserOrderField = (typeof GropiusUserOrderField)[keyof typeof GropiusUserOrderField];
/** Fields a list of IMSIssue can be sorted by */
export const ImsIssueOrderField = {
    /** Order by id */
    Id: "ID",
    /** Order by template_id */
    TemplateId: "TEMPLATE_ID",
    /** Order by template_name */
    TemplateName: "TEMPLATE_NAME"
} as const;

export type ImsIssueOrderField = (typeof ImsIssueOrderField)[keyof typeof ImsIssueOrderField];
/** Fields a list of IMS can be sorted by */
export const ImsOrderField = {
    /** Order by id */
    Id: "ID",
    /** Order by name */
    Name: "NAME",
    /** Order by template_id */
    TemplateId: "TEMPLATE_ID",
    /** Order by template_name */
    TemplateName: "TEMPLATE_NAME"
} as const;

export type ImsOrderField = (typeof ImsOrderField)[keyof typeof ImsOrderField];
/** IMSPermission entry enum type. */
export const ImsPermissionEntry = {
    /** Grants all other permissions on the Node except READ. */
    Admin: "ADMIN",
    /**
     * Allows to read the Node (obtain it via the API) and to read certain related Nodes.
     * See documentation for specific Node for the specific conditions.
     */
    Read: "READ",
    /** Allows to create IMSProjects with this IMS. */
    SyncTrackables: "SYNC_TRACKABLES"
} as const;

export type ImsPermissionEntry = (typeof ImsPermissionEntry)[keyof typeof ImsPermissionEntry];
/** Fields a list of IMSPermission can be sorted by */
export const ImsPermissionOrderField = {
    /** Order by allUsers */
    AllUsers: "ALL_USERS",
    /** Order by id */
    Id: "ID",
    /** Order by name */
    Name: "NAME"
} as const;

export type ImsPermissionOrderField = (typeof ImsPermissionOrderField)[keyof typeof ImsPermissionOrderField];
/** Fields a list of IMSProject can be sorted by */
export const ImsProjectOrderField = {
    /** Order by id */
    Id: "ID",
    /** Order by ims_id */
    ImsId: "IMS_ID",
    /** Order by ims_name */
    ImsName: "IMS_NAME",
    /** Order by name */
    Name: "NAME",
    /** Order by template_id */
    TemplateId: "TEMPLATE_ID",
    /** Order by template_name */
    TemplateName: "TEMPLATE_NAME"
} as const;

export type ImsProjectOrderField = (typeof ImsProjectOrderField)[keyof typeof ImsProjectOrderField];
/** Fields a list of IMSTemplate can be sorted by */
export const ImsTemplateOrderField = {
    /** Order by id */
    Id: "ID",
    /** Order by name */
    Name: "NAME"
} as const;

export type ImsTemplateOrderField = (typeof ImsTemplateOrderField)[keyof typeof ImsTemplateOrderField];
/** Fields a list of IMSUser can be sorted by */
export const ImsUserOrderField = {
    /** Order by displayName */
    DisplayName: "DISPLAY_NAME",
    /** Order by email */
    Email: "EMAIL",
    /** Order by id */
    Id: "ID",
    /** Order by username */
    Username: "USERNAME"
} as const;

export type ImsUserOrderField = (typeof ImsUserOrderField)[keyof typeof ImsUserOrderField];
/** Fields a list of InterfaceDefinition can be sorted by */
export const InterfaceDefinitionOrderField = {
    /** Order by id */
    Id: "ID",
    /** Order by interfaceSpecificationVersion_id */
    InterfaceSpecificationVersionId: "INTERFACE_SPECIFICATION_VERSION_ID",
    /** Order by interfaceSpecificationVersion_version */
    InterfaceSpecificationVersionVersion: "INTERFACE_SPECIFICATION_VERSION_VERSION",
    /** Order by invisibleSelfDefined */
    InvisibleSelfDefined: "INVISIBLE_SELF_DEFINED",
    /** Order by visibleSelfDefined */
    VisibleSelfDefined: "VISIBLE_SELF_DEFINED"
} as const;

export type InterfaceDefinitionOrderField =
    (typeof InterfaceDefinitionOrderField)[keyof typeof InterfaceDefinitionOrderField];
/** Fields a list of InterfacePart can be sorted by */
export const InterfacePartOrderField = {
    /** Order by id */
    Id: "ID",
    /** Order by name */
    Name: "NAME",
    /** Order by template_id */
    TemplateId: "TEMPLATE_ID",
    /** Order by template_name */
    TemplateName: "TEMPLATE_NAME"
} as const;

export type InterfacePartOrderField = (typeof InterfacePartOrderField)[keyof typeof InterfacePartOrderField];
/** Fields a list of InterfaceSpecificationDerivationCondition can be sorted by */
export const InterfaceSpecificationDerivationConditionOrderField = {
    /** Order by id */
    Id: "ID"
} as const;

export type InterfaceSpecificationDerivationConditionOrderField =
    (typeof InterfaceSpecificationDerivationConditionOrderField)[keyof typeof InterfaceSpecificationDerivationConditionOrderField];
/** Fields a list of InterfaceSpecification can be sorted by */
export const InterfaceSpecificationOrderField = {
    /** Order by id */
    Id: "ID",
    /** Order by name */
    Name: "NAME",
    /** Order by template_id */
    TemplateId: "TEMPLATE_ID",
    /** Order by template_name */
    TemplateName: "TEMPLATE_NAME"
} as const;

export type InterfaceSpecificationOrderField =
    (typeof InterfaceSpecificationOrderField)[keyof typeof InterfaceSpecificationOrderField];
/** Fields a list of InterfaceSpecificationTemplate can be sorted by */
export const InterfaceSpecificationTemplateOrderField = {
    /** Order by id */
    Id: "ID",
    /** Order by name */
    Name: "NAME"
} as const;

export type InterfaceSpecificationTemplateOrderField =
    (typeof InterfaceSpecificationTemplateOrderField)[keyof typeof InterfaceSpecificationTemplateOrderField];
/** Fields a list of InterfaceSpecificationVersion can be sorted by */
export const InterfaceSpecificationVersionOrderField = {
    /** Order by id */
    Id: "ID",
    /** Order by template_id */
    TemplateId: "TEMPLATE_ID",
    /** Order by template_name */
    TemplateName: "TEMPLATE_NAME",
    /** Order by version */
    Version: "VERSION"
} as const;

export type InterfaceSpecificationVersionOrderField =
    (typeof InterfaceSpecificationVersionOrderField)[keyof typeof InterfaceSpecificationVersionOrderField];
/** Fields a list of IntraComponentDependencyParticipant can be sorted by */
export const IntraComponentDependencyParticipantOrderField = {
    /** Order by id */
    Id: "ID"
} as const;

export type IntraComponentDependencyParticipantOrderField =
    (typeof IntraComponentDependencyParticipantOrderField)[keyof typeof IntraComponentDependencyParticipantOrderField];
/** Fields a list of IntraComponentDependencySpecification can be sorted by */
export const IntraComponentDependencySpecificationOrderField = {
    /** Order by id */
    Id: "ID",
    /** Order by name */
    Name: "NAME",
    /** Order by type_id */
    TypeId: "TYPE_ID",
    /** Order by type_name */
    TypeName: "TYPE_NAME"
} as const;

export type IntraComponentDependencySpecificationOrderField =
    (typeof IntraComponentDependencySpecificationOrderField)[keyof typeof IntraComponentDependencySpecificationOrderField];
/** Fields a list of IntraComponentDependencySpecificationType can be sorted by */
export const IntraComponentDependencySpecificationTypeOrderField = {
    /** Order by id */
    Id: "ID",
    /** Order by name */
    Name: "NAME"
} as const;

export type IntraComponentDependencySpecificationTypeOrderField =
    (typeof IntraComponentDependencySpecificationTypeOrderField)[keyof typeof IntraComponentDependencySpecificationTypeOrderField];
/** Fields a list of IssueComment can be sorted by */
export const IssueCommentOrderField = {
    /** Order by bodyLastEditedAt */
    BodyLastEditedAt: "BODY_LAST_EDITED_AT",
    /** Order by createdAt */
    CreatedAt: "CREATED_AT",
    /** Order by id */
    Id: "ID",
    /** Order by lastModifiedAt */
    LastModifiedAt: "LAST_MODIFIED_AT"
} as const;

export type IssueCommentOrderField = (typeof IssueCommentOrderField)[keyof typeof IssueCommentOrderField];
/** Fields a list of Issue can be sorted by */
export const IssueOrderField = {
    /** Order by createdAt */
    CreatedAt: "CREATED_AT",
    /** Order by id */
    Id: "ID",
    /** Order by lastModifiedAt */
    LastModifiedAt: "LAST_MODIFIED_AT",
    /** Order by lastUpdatedAt */
    LastUpdatedAt: "LAST_UPDATED_AT",
    /** Order by priority_id */
    PriorityId: "PRIORITY_ID",
    /** Order by priority_name */
    PriorityName: "PRIORITY_NAME",
    /** Order by priority_value */
    PriorityValue: "PRIORITY_VALUE",
    /** Order by state_id */
    StateId: "STATE_ID",
    /** Order by state_isOpen */
    StateIsOpen: "STATE_IS_OPEN",
    /** Order by state_name */
    StateName: "STATE_NAME",
    /** Order by template_id */
    TemplateId: "TEMPLATE_ID",
    /** Order by template_name */
    TemplateName: "TEMPLATE_NAME",
    /** Order by title */
    Title: "TITLE",
    /** Order by type_id */
    TypeId: "TYPE_ID",
    /** Order by type_name */
    TypeName: "TYPE_NAME"
} as const;

export type IssueOrderField = (typeof IssueOrderField)[keyof typeof IssueOrderField];
/** Fields a list of IssuePriority can be sorted by */
export const IssuePriorityOrderField = {
    /** Order by id */
    Id: "ID",
    /** Order by name */
    Name: "NAME",
    /** Order by value */
    Value: "VALUE"
} as const;

export type IssuePriorityOrderField = (typeof IssuePriorityOrderField)[keyof typeof IssuePriorityOrderField];
/** Fields a list of IssueRelation can be sorted by */
export const IssueRelationOrderField = {
    /** Order by createdAt */
    CreatedAt: "CREATED_AT",
    /** Order by id */
    Id: "ID",
    /** Order by lastModifiedAt */
    LastModifiedAt: "LAST_MODIFIED_AT"
} as const;

export type IssueRelationOrderField = (typeof IssueRelationOrderField)[keyof typeof IssueRelationOrderField];
/** Fields a list of IssueRelationType can be sorted by */
export const IssueRelationTypeOrderField = {
    /** Order by id */
    Id: "ID",
    /** Order by inverseName */
    InverseName: "INVERSE_NAME",
    /** Order by name */
    Name: "NAME"
} as const;

export type IssueRelationTypeOrderField =
    (typeof IssueRelationTypeOrderField)[keyof typeof IssueRelationTypeOrderField];
/** Fields a list of IssueState can be sorted by */
export const IssueStateOrderField = {
    /** Order by id */
    Id: "ID",
    /** Order by isOpen */
    IsOpen: "IS_OPEN",
    /** Order by name */
    Name: "NAME"
} as const;

export type IssueStateOrderField = (typeof IssueStateOrderField)[keyof typeof IssueStateOrderField];
/** Fields a list of IssueTemplate can be sorted by */
export const IssueTemplateOrderField = {
    /** Order by id */
    Id: "ID",
    /** Order by name */
    Name: "NAME"
} as const;

export type IssueTemplateOrderField = (typeof IssueTemplateOrderField)[keyof typeof IssueTemplateOrderField];
/** Fields a list of IssueType can be sorted by */
export const IssueTypeOrderField = {
    /** Order by id */
    Id: "ID",
    /** Order by name */
    Name: "NAME"
} as const;

export type IssueTypeOrderField = (typeof IssueTypeOrderField)[keyof typeof IssueTypeOrderField];
/** Fields a list of Label can be sorted by */
export const LabelOrderField = {
    /** Order by color */
    Color: "COLOR",
    /** Order by createdAt */
    CreatedAt: "CREATED_AT",
    /** Order by id */
    Id: "ID",
    /** Order by lastModifiedAt */
    LastModifiedAt: "LAST_MODIFIED_AT",
    /** Order by name */
    Name: "NAME"
} as const;

export type LabelOrderField = (typeof LabelOrderField)[keyof typeof LabelOrderField];
/** Fields a list of LegalInformation can be sorted by */
export const LegalInformationOrderField = {
    /** Order by id */
    Id: "ID",
    /** Order by priority */
    Priority: "PRIORITY"
} as const;

export type LegalInformationOrderField = (typeof LegalInformationOrderField)[keyof typeof LegalInformationOrderField];
/** Type of a Relation marker */
export const MarkerType = {
    /** A regular arrow */
    Arrow: "ARROW",
    /** A circle */
    Circle: "CIRCLE",
    /** A diamond */
    Diamond: "DIAMOND",
    /** A filled circle */
    FilledCircle: "FILLED_CIRCLE",
    /** A filled diamond */
    FilledDiamond: "FILLED_DIAMOND",
    /** A filled triangle */
    FilledTriangle: "FILLED_TRIANGLE",
    /** A triangle */
    Triangle: "TRIANGLE"
} as const;

export type MarkerType = (typeof MarkerType)[keyof typeof MarkerType];
/** Possible direction in which a list of nodes can be ordered */
export const OrderDirection = {
    /** Ascending */
    Asc: "ASC",
    /** Descending */
    Desc: "DESC"
} as const;

export type OrderDirection = (typeof OrderDirection)[keyof typeof OrderDirection];
/** Permission entry enum type. */
export const PermissionEntry = {
    /** Allows to create new Components. */
    CanCreateComponents: "CAN_CREATE_COMPONENTS",
    /** Allows to create new IMSs. */
    CanCreateImss: "CAN_CREATE_IMSS",
    /** Allows to create new Projects. */
    CanCreateProjects: "CAN_CREATE_PROJECTS",
    /** Allows to create new Templates. */
    CanCreateTemplates: "CAN_CREATE_TEMPLATES"
} as const;

export type PermissionEntry = (typeof PermissionEntry)[keyof typeof PermissionEntry];
/** Fields a list of Project can be sorted by */
export const ProjectOrderField = {
    /** Order by id */
    Id: "ID",
    /** Order by name */
    Name: "NAME"
} as const;

export type ProjectOrderField = (typeof ProjectOrderField)[keyof typeof ProjectOrderField];
/** ProjectPermission entry enum type. */
export const ProjectPermissionEntry = {
    /** Grants all other permissions on the Node except READ. */
    Admin: "ADMIN",
    /**
     * Allows affecting entities part of this Trackable with any Issues.
     * Affectable entitites include
     *   - the Trackable itself
     *   - in case the Trackable is a Component
     *     - InterfaceSpecifications, their InterfaceSpecificationVersions and their InterfaceParts of the Component (not inherited ones)
     *     - Interfaces on the Component
     *     - ComponentVersions of the Component
     */
    AffectEntitiesWithIssues: "AFFECT_ENTITIES_WITH_ISSUES",
    /**
     * Allows to create Comments on Issues on this Trackable.
     * Also allows editing of your own Comments.
     */
    Comment: "COMMENT",
    /**
     * Allows to create new Issues on the Trackable.
     * This includes adding Issues from other Trackables.
     */
    CreateIssues: "CREATE_ISSUES",
    /** Allows adding Issues on this Trackable to other Trackables. */
    ExportIssues: "EXPORT_ISSUES",
    /** Allows adding Labels on this Trackable to other Trackables. */
    ExportLabels: "EXPORT_LABELS",
    /** Allows to add, remove, and update Artefacts on this Trackable. */
    ManageArtefacts: "MANAGE_ARTEFACTS",
    /** Allows to add / remove ComponentVersions to / from this Project. */
    ManageComponents: "MANAGE_COMPONENTS",
    /**
     * Allows to add, remove, and update IMSProjects on this Trackable.
     * Note: for adding, `IMSPermissionEntry.SYNC_TRACKABLES` is required additionally
     */
    ManageIms: "MANAGE_IMS",
    /**
     * Allows to manage issues.
     * This includes `CREATE_ISSUES` and `COMMENT`.
     * This does NOT include `LINK_TO_ISSUES` and `LINK_FROM_ISSUES`.
     * Additionaly includes
     *   - change the Template
     *   - add / remove Labels
     *   - add / remove Artefacts
     *   - change any field on the Issue (title, ...)
     *   - change templated fields
     * In contrast to `MODERATOR`, this does not allow editing / removing Comments of other users
     */
    ManageIssues: "MANAGE_ISSUES",
    /**
     * Allows to add, remove, and update Labels on this Trackable.
     * Also allows to delete a Label, but only if it is allowed on all Trackable the Label is on.
     */
    ManageLabels: "MANAGE_LABELS",
    /** Allows to manage the views of this Project. */
    ManageViews: "MANAGE_VIEWS",
    /**
     * Allows to moderate Issues on this Trackable.
     * This allows everything `MANAGE_ISSUES` allows.
     * Additionally, it allows editing and deleting Comments of other Users
     */
    Moderator: "MODERATOR",
    /**
     * Allows to read the Node (obtain it via the API) and to read certain related Nodes.
     * See documentation for specific Node for the specific conditions.
     */
    Read: "READ"
} as const;

export type ProjectPermissionEntry = (typeof ProjectPermissionEntry)[keyof typeof ProjectPermissionEntry];
/** Fields a list of ProjectPermission can be sorted by */
export const ProjectPermissionOrderField = {
    /** Order by allUsers */
    AllUsers: "ALL_USERS",
    /** Order by id */
    Id: "ID",
    /** Order by name */
    Name: "NAME"
} as const;

export type ProjectPermissionOrderField =
    (typeof ProjectPermissionOrderField)[keyof typeof ProjectPermissionOrderField];
/** Fields a list of RelationCondition can be sorted by */
export const RelationConditionOrderField = {
    /** Order by id */
    Id: "ID"
} as const;

export type RelationConditionOrderField =
    (typeof RelationConditionOrderField)[keyof typeof RelationConditionOrderField];
/** Fields a list of RelationLayout can be sorted by */
export const RelationLayoutOrderField = {
    /** Order by id */
    Id: "ID"
} as const;

export type RelationLayoutOrderField = (typeof RelationLayoutOrderField)[keyof typeof RelationLayoutOrderField];
/** Fields a list of Relation can be sorted by */
export const RelationOrderField = {
    /** Order by end_id */
    EndId: "END_ID",
    /** Order by id */
    Id: "ID",
    /** Order by start_id */
    StartId: "START_ID",
    /** Order by template_id */
    TemplateId: "TEMPLATE_ID",
    /** Order by template_name */
    TemplateName: "TEMPLATE_NAME"
} as const;

export type RelationOrderField = (typeof RelationOrderField)[keyof typeof RelationOrderField];
/** Fields a list of RelationPartnerLayout can be sorted by */
export const RelationPartnerLayoutOrderField = {
    /** Order by id */
    Id: "ID"
} as const;

export type RelationPartnerLayoutOrderField =
    (typeof RelationPartnerLayoutOrderField)[keyof typeof RelationPartnerLayoutOrderField];
/** Fields a list of RelationPartnerTemplate can be sorted by */
export const RelationPartnerTemplateOrderField = {
    /** Order by id */
    Id: "ID",
    /** Order by name */
    Name: "NAME"
} as const;

export type RelationPartnerTemplateOrderField =
    (typeof RelationPartnerTemplateOrderField)[keyof typeof RelationPartnerTemplateOrderField];
/** Fields a list of RelationTemplate can be sorted by */
export const RelationTemplateOrderField = {
    /** Order by id */
    Id: "ID",
    /** Order by name */
    Name: "NAME"
} as const;

export type RelationTemplateOrderField = (typeof RelationTemplateOrderField)[keyof typeof RelationTemplateOrderField];
/** Type of a Shape */
export const ShapeType = {
    /** A Circle */
    Circle: "CIRCLE",
    /** An Ellipse */
    Ellipse: "ELLIPSE",
    /** A Hexagon */
    Hexagon: "HEXAGON",
    /** A Rectangle */
    Rect: "RECT",
    /** A Rhombus */
    Rhombus: "RHOMBUS"
} as const;

export type ShapeType = (typeof ShapeType)[keyof typeof ShapeType];
/** Fields a list of SyncPermissionTarget can be sorted by */
export const SyncPermissionTargetOrderField = {
    /** Order by id */
    Id: "ID",
    /** Order by name */
    Name: "NAME"
} as const;

export type SyncPermissionTargetOrderField =
    (typeof SyncPermissionTargetOrderField)[keyof typeof SyncPermissionTargetOrderField];
/** Fields a list of TimelineItem can be sorted by */
export const TimelineItemOrderField = {
    /** Order by createdAt */
    CreatedAt: "CREATED_AT",
    /** Order by id */
    Id: "ID",
    /** Order by lastModifiedAt */
    LastModifiedAt: "LAST_MODIFIED_AT"
} as const;

export type TimelineItemOrderField = (typeof TimelineItemOrderField)[keyof typeof TimelineItemOrderField];
/** All timeline items types */
export const TimelineItemType = {
    /** AbstractTypeChangedEvent timeline item */
    AbstractTypeChangedEvent: "ABSTRACT_TYPE_CHANGED_EVENT",
    /** AddedAffectedEntityEvent timeline item */
    AddedAffectedEntityEvent: "ADDED_AFFECTED_ENTITY_EVENT",
    /** AddedArtefactEvent timeline item */
    AddedArtefactEvent: "ADDED_ARTEFACT_EVENT",
    /** AddedLabelEvent timeline item */
    AddedLabelEvent: "ADDED_LABEL_EVENT",
    /** AddedToPinnedIssuesEvent timeline item */
    AddedToPinnedIssuesEvent: "ADDED_TO_PINNED_ISSUES_EVENT",
    /** AddedToTrackableEvent timeline item */
    AddedToTrackableEvent: "ADDED_TO_TRACKABLE_EVENT",
    /** Assignment timeline item */
    Assignment: "ASSIGNMENT",
    /** AssignmentTypeChangedEvent timeline item */
    AssignmentTypeChangedEvent: "ASSIGNMENT_TYPE_CHANGED_EVENT",
    /** Body timeline item */
    Body: "BODY",
    /** Comment timeline item */
    Comment: "COMMENT",
    /** IncomingRelationTypeChangedEvent timeline item */
    IncomingRelationTypeChangedEvent: "INCOMING_RELATION_TYPE_CHANGED_EVENT",
    /** IssueComment timeline item */
    IssueComment: "ISSUE_COMMENT",
    /** IssueRelation timeline item */
    IssueRelation: "ISSUE_RELATION",
    /** OutgoingRelationTypeChangedEvent timeline item */
    OutgoingRelationTypeChangedEvent: "OUTGOING_RELATION_TYPE_CHANGED_EVENT",
    /** ParentTimelineItem timeline item */
    ParentTimelineItem: "PARENT_TIMELINE_ITEM",
    /** PriorityChangedEvent timeline item */
    PriorityChangedEvent: "PRIORITY_CHANGED_EVENT",
    /** PublicTimelineItem timeline item */
    PublicTimelineItem: "PUBLIC_TIMELINE_ITEM",
    /** RelatedByIssueEvent timeline item */
    RelatedByIssueEvent: "RELATED_BY_ISSUE_EVENT",
    /** RelationTypeChangedEvent timeline item */
    RelationTypeChangedEvent: "RELATION_TYPE_CHANGED_EVENT",
    /** RemovedAffectedEntityEvent timeline item */
    RemovedAffectedEntityEvent: "REMOVED_AFFECTED_ENTITY_EVENT",
    /** RemovedArtefactEvent timeline item */
    RemovedArtefactEvent: "REMOVED_ARTEFACT_EVENT",
    /** RemovedAssignmentEvent timeline item */
    RemovedAssignmentEvent: "REMOVED_ASSIGNMENT_EVENT",
    /** RemovedFromPinnedIssuesEvent timeline item */
    RemovedFromPinnedIssuesEvent: "REMOVED_FROM_PINNED_ISSUES_EVENT",
    /** RemovedFromTrackableEvent timeline item */
    RemovedFromTrackableEvent: "REMOVED_FROM_TRACKABLE_EVENT",
    /** RemovedIncomingRelationEvent timeline item */
    RemovedIncomingRelationEvent: "REMOVED_INCOMING_RELATION_EVENT",
    /** RemovedLabelEvent timeline item */
    RemovedLabelEvent: "REMOVED_LABEL_EVENT",
    /** RemovedOutgoingRelationEvent timeline item */
    RemovedOutgoingRelationEvent: "REMOVED_OUTGOING_RELATION_EVENT",
    /** RemovedRelationEvent timeline item */
    RemovedRelationEvent: "REMOVED_RELATION_EVENT",
    /** RemovedTemplatedFieldEvent timeline item */
    RemovedTemplatedFieldEvent: "REMOVED_TEMPLATED_FIELD_EVENT",
    /** StateChangedEvent timeline item */
    StateChangedEvent: "STATE_CHANGED_EVENT",
    /** TemplatedFieldChangedEvent timeline item */
    TemplatedFieldChangedEvent: "TEMPLATED_FIELD_CHANGED_EVENT",
    /** TemplateChangedEvent timeline item */
    TemplateChangedEvent: "TEMPLATE_CHANGED_EVENT",
    /** TimelineItem timeline item */
    TimelineItem: "TIMELINE_ITEM",
    /** TitleChangedEvent timeline item */
    TitleChangedEvent: "TITLE_CHANGED_EVENT",
    /** TypeChangedEvent timeline item */
    TypeChangedEvent: "TYPE_CHANGED_EVENT"
} as const;

export type TimelineItemType = (typeof TimelineItemType)[keyof typeof TimelineItemType];
/** Fields a list of Trackable can be sorted by */
export const TrackableOrderField = {
    /** Order by id */
    Id: "ID",
    /** Order by name */
    Name: "NAME"
} as const;

export type TrackableOrderField = (typeof TrackableOrderField)[keyof typeof TrackableOrderField];
/** Fields a list of User can be sorted by */
export const UserOrderField = {
    /** Order by displayName */
    DisplayName: "DISPLAY_NAME",
    /** Order by email */
    Email: "EMAIL",
    /** Order by id */
    Id: "ID",
    /** Order by username */
    Username: "USERNAME"
} as const;

export type UserOrderField = (typeof UserOrderField)[keyof typeof UserOrderField];
/** Fields a list of View can be sorted by */
export const ViewOrderField = {
    /** Order by id */
    Id: "ID",
    /** Order by name */
    Name: "NAME"
} as const;

export type ViewOrderField = (typeof ViewOrderField)[keyof typeof ViewOrderField];
