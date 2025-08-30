<template>
  <v-dialog v-model="createIssueTemplateDialog" persistent width="auto">
    <v-card color="surface-elevated-3" rounded="lger" class="pa-3" elevation="0">
      <v-card-title class="pl-4">Create Issue Template</v-card-title>
      <v-stepper class="d-flex flex-column" v-model="step" :items="stepLabels" hide-actions bg-color="surface-elevated-3" flat >

        <!-- Step 1: General Info -->
        <template v-slot:item.1>
          <v-form v-model="formGeneralValid" validate-on="blur">
            <v-text-field v-model="templateName" v-bind="templateNameProps" label="Name" class="mb-2" />
            <v-textarea v-model="templateDescription" v-bind="templateDescriptionProps" label="Description" class="mb-2" />
            <v-text-field v-model="repositoryURL" v-bind="repositoryURLProps" label="Repository URL" class="mb-2" />
          </v-form>
        </template>

        <!-- Step 2: Issue Types, Priorities & States -->
        <template v-slot:item.2>
          <v-form v-model="formIssueTypesValid">
            <v-row>
                <!-- Issue Types -->
                <v-col cols="4">
                    <v-btn
                        variant="outlined"
                        block
                        color="primary"
                        class="bg-white text-primary rounded-sm px-4 py-2"
                         @click="() => {createIssueType('', '', '', ''); expandedCardKey = { nameID: '', type: 'type'};}"
                        >+ Add Issue Type
                    </v-btn>
                    <ExpandableCard
                       v-for="issueType in issueTypes"
                      :key="issueType.name"
                      :name="issueType.name"
                      :description="issueType.description"
                      :expandedCardKey="expandedCardKey"
                      type="type"
                      :nameErrorMessage="nameErrorMessage"
                      @expand="() => {
                        expandedCardKey = { nameID: issueType.name, type: 'type' }
                         selectedIcon = iconList.find(icon => icon.iconPath === issueType.iconPath) ?? null
                         currentEditedName = issueType.name
                         currentEditedDescription = issueType.description
                         nameErrorMessage = ''
                      }"
                      @cancel="cancelCreateCard();"
                      @delete="deleteIssueTypeByName(issueType.name)"
                      @confirm="({ name, description }) => {
                        if (!name) {nameErrorMessage = 'Name is required'; return}
                        createIssueType(issueType.name, name, description, selectedIcon?.iconPath ?? '')
                        }"
                    >
                      <!-- collapsed preview slot -->
                      <template #preview1>
                        <div
                          class="border rounded d-flex align-center mx-2 my-1"
                          v-html="wrappedSvg(issueType.iconPath)"
                        />
                      </template>

                      <!-- expanded extra slot -->
                      <template #extra>
                        <div class="d-flex align-center justify-center">
                          <v-tabs v-model="activeTab" density="compact" class="flex-grow-1">
                            <v-tab value="select" class="flex-grow-1">Select Icon</v-tab>
                            <v-tab value="add" class="flex-grow-1">Add Icon</v-tab>
                          </v-tabs>
                        </div>
                        
                        <v-window v-model="activeTab">
                          <!-- Select Tab -->
                          <v-window-item value="select">
                            <v-text-field
                              v-model="iconSearch"
                              label="Search"
                              density="compact"
                              hide-details class="mb-2"
                              prepend-inner-icon="mdi-magnify"
                              clearable
                            >
                            </v-text-field>
                            <div class="icon-container mx-n2">
                              <div
                                v-for="icon in filteredIcons"
                                :key="icon.name"
                                class="icon-wrapper"
                                :class="{ selected: selectedIcon?.name === icon.name }"
                                @click="selectIcon(icon)"
                                v-html="wrappedSvg(icon.iconPath)"
                              />
                            </div>
                          </v-window-item>

                          <!-- Add Tab -->
                          <v-window-item value="add">
                            <div class="d-flex flex-column">
                              <v-text-field
                                v-model="newIcon.name"
                                label="Icon Name"
                                density="compact"
                                hide-details
                                class="mb-6"
                              />

                              <!-- Path input with clear -->
                              <v-text-field
                                v-model="newIcon.iconPath"
                                label="SVG Path"
                                density="compact"
                                hide-details
                                class="scroll-x mb-4"
                                clearable
                              />

                              <!-- Preview + confirm -->
                              <div class="d-flex align-center">
                                <v-text class="mr-2">Preview:</v-text>
                                <div
                                  class="preview-box border rounded mr-2 d-flex align-center justify-center"
                                  v-html="wrappedSvg(newIcon.iconPath)"
                                />
                                <v-btn
                                  color="primary"
                                  size="small"
                                  :disabled="!newIcon.name || !newIcon.iconPath"
                                  @click="confirmAddIcon"
                                >
                                Add
                                </v-btn>
                              </div>

                              <!-- Warning if invalid -->
                              <div v-if="newIcon.iconPath" class="text-error text-caption">
                              ⚠️ Path möglicherweise außerhalb von 100x100 ViewBox
                              </div>
                            </div>
                          </v-window-item>
                        </v-window>
                 
                      </template>
                    </ExpandableCard>
                </v-col>
                <!-- Issue Priorities -->
                <v-col cols="4">
                    <v-btn
                        variant="outlined"
                        block
                        color="primary"
                        class="bg-white text-primary rounded-sm px-4 py-2"
                        @click="() => {createIssuePriority('', '', '', 0); expandedCardKey = { nameID: '', type: 'priority'};}"
                        >+ Add Issue Priority
                    </v-btn>
                    <ExpandableCard
                      v-for="issuePriority in issuePriorities"
                      :key="issuePriority.name"
                      :name="issuePriority.name"
                      :description="issuePriority.description"
                      :expandedCardKey="expandedCardKey"
                      type="priority"
                      :nameErrorMessage="nameErrorMessage"
                      @expand="() => {
                        expandedCardKey = { nameID: issuePriority.name, type: 'priority' }
                         currentEditedName = issuePriority.name
                         currentEditedDescription = issuePriority.description
                         currentEditedValue = issuePriority.value
                         nameErrorMessage = ''
                      }"
                      @cancel="() => {cancelCreateCard(); issuePriority.value = currentEditedValue;}"
                      @delete="deleteIssuePriorityByName(issuePriority.name)"
                      @confirm="({ name, description }) => {
                        if (!name) {nameErrorMessage = 'Name is required'; return}
                        createIssuePriority(issuePriority.name, name, description, issuePriority.value)
                        }"
                      
                    >
                      <!-- collapsed preview slot -->
                      <template #preview2>
                        <div class="border rounded d-flex align-center mr-4 my-1">
                          <span class="text-h6 mx-1">
                            {{
                            (issuePriority.value.toString().length > 3
                            ? issuePriority.value.toString().slice(0, 3) + "…"
                            : issuePriority.value.toString())
                            }}
                          </span>
                        </div>
                      </template>


                      <!-- expanded extra slot -->
                      <template #extra>
                        <v-text-field
                          v-model.number="issuePriority.value"
                          label="Value"
                          class="mx-2 mb-2"
                          density="compact"
                          type="number"
                          :error="!!valueErrorMessage"
                          :error-messages="valueErrorMessage"
                        />
                      </template>
                  </ExpandableCard>
                </v-col>
                <!-- Issue States -->
                <v-col cols="4">
                    <v-btn
                        variant="outlined"
                        block
                        color="primary"
                        class="bg-white text-primary rounded-sm px-4 py-2"
                        @click="() => {createIssueState('', '', '', true); expandedCardKey = { nameID: '', type: 'state'};}"
                        >+ Add Issue State
                    </v-btn>
                    
                    <ExpandableCard
                      v-for="issueState in issueStates"
                      :key="issueState.name"
                      :name="issueState.name"
                      :description="issueState.description"
                      :expandedCardKey="expandedCardKey"
                      type="state"
                      :nameErrorMessage="nameErrorMessage"
                      @expand="() => {
                        expandedCardKey = { nameID: issueState.name, type: 'state' }
                         currentEditedName = issueState.name
                         currentEditedDescription = issueState.description
                         currentEditedIsOpen = issueState.isOpen
                         nameErrorMessage = ''
                      }"
                      @cancel="() => {cancelCreateCard(); issueState.isOpen = currentEditedIsOpen;}"
                      @delete="deleteIssueStateByName(issueState.name)"
                      @confirm="({ name, description }) => {
                        if (!name) {nameErrorMessage = 'Name is required'; return}
                        createIssueState(issueState.name, name, description, issueState.isOpen)
                        }"
                    >
                      <!-- collapsed preview slot -->
                      <template #preview1>
                        <div class="mx-2">
                          <v-icon :color="issueState.isOpen ? 'success' : 'error'">mdi-circle</v-icon>
                        </div>
                      </template>

                      <!-- expanded extra slot -->
                      <template #extra>
                        <v-checkbox v-model="issueState.isOpen" label="Open?" />
                      </template>
                  </ExpandableCard>

                </v-col>

            </v-row>
          </v-form>
        </template>

        <!-- Step 3: Assignment & Telation Types -->
        <template v-slot:item.3>
          <v-form v-model="formIssuePrioritiesValid">
            <v-row>
              <v-col cols="6">
                <v-btn
                        variant="outlined"
                        block
                        color="primary"
                        class="bg-white text-primary rounded-sm px-4 py-2"
                        @click="() => {createAssignmentType('', '', ''); expandedCardKey = { nameID: '', type: 'assignment'};}"
                        >+ Add Assignment Type
                    </v-btn>
                    <!-- Assignment Types -->
                    <ExpandableCard
                      v-for="assignmentType in assignmentTypes"
                      :key="assignmentType.name"
                      :name="assignmentType.name"
                      :description="assignmentType.description"
                      :expandedCardKey="expandedCardKey"
                      type="assignment"
                      :nameErrorMessage="nameErrorMessage"
                      @expand="() => {
                        expandedCardKey = { nameID: assignmentType.name, type: 'assignment' }
                         currentEditedName = assignmentType.name
                         currentEditedDescription = assignmentType.description
                         nameErrorMessage = ''
                      }"
                      @cancel="() => {cancelCreateCard(); assignmentType.name = currentEditedName; assignmentType.description = currentEditedDescription;}"
                      @delete="deleteAssignmentTypeByName(assignmentType.name)"
                      @confirm="({ name, description }) => {
                        if (!name) {nameErrorMessage = 'Name is required'; return}
                        createAssignmentType(assignmentType.name, name, description)
                        }"
                      
                    >
                      <!-- collapsed preview slot -->
                      <template #preview2>
                        <div class="border rounded d-flex align-center mr-4 my-1">
                          <span class="text-h6 mx-1">
                            placeholder
                          </span>
                        </div>
                      </template>
                  </ExpandableCard>
              </v-col>
              <v-col cols="6">
                <v-btn
                        variant="outlined"
                        block
                        color="primary"
                        class="bg-white text-primary rounded-sm px-4 py-2"
                        @click="() => {createRelationType('', '', '', ''); expandedCardKey = { nameID: '', type: 'relation'};}"
                        >+ Add Relation Type
                    </v-btn>
                    <!-- Relation Types -->
                    <ExpandableCard
                      v-for="relationType in relationTypes"
                      :key="relationType.name"
                      :name="relationType.name"
                      :description="relationType.description"
                      :expandedCardKey="expandedCardKey"
                      type="relation"
                      :nameErrorMessage="nameErrorMessage"
                      @expand="() => {
                        expandedCardKey = { nameID: relationType.name, type: 'relation' }
                         currentEditedName = relationType.name
                         currentEditedDescription = relationType.description
                         currentEditedInverseName = relationType.inverseName
                         nameErrorMessage = ''
                         inverseNameErrorMessage = ''
                      }"
                      @cancel="() => {cancelCreateCard(); relationType.inverseName = currentEditedInverseName;}"
                      @delete="deleteRelationTypeByName(relationType.name)"
                      @confirm="({ name, description }) => {
                        if (!name) {nameErrorMessage = 'Name is required'; return}
                        if (!relationType.inverseName) {inverseNameErrorMessage = 'Inverse Name is required'; return}
                        createRelationType(relationType.name, name, relationType.inverseName, description)
                        }"
                      
                    >
                      <!-- collapsed preview slot -->
                      <template #preview2>
                        <div class="border rounded d-flex align-center mr-4 my-1">
                          <span class="text-h6 mx-1">
                            placeholder
                          </span>
                        </div>
                      </template>


                      <!-- expanded extra slot -->
                      <template #extra>
                        <v-text-field
                          v-model="relationType.inverseName"
                          label="Inverse Name"
                          class="mx-2 mb-2"
                          density="compact"
                          :error="!!inverseNameErrorMessage"
                          :error-messages="inverseNameErrorMessage"
                        />
                      </template>
                  </ExpandableCard>
              </v-col>
            </v-row>
          </v-form>
        </template>

        <!-- Step 4: Issue States -->
        <template v-slot:item.4>
          <v-form v-model="formIssueStatesValid">
            <v-combobox v-model="issueStates" label="Issue States" multiple chips clearable class="mb-2" />
          </v-form>
        </template>

        <!-- Step 5 - 7: Placeholder Steps -->
        <template v-slot:item.5>
          <v-form v-model="formAssignmentTypeValid">
            <v-alert type="info">Assignment Type (Placeholder)</v-alert>
          </v-form>
        </template>
        <template v-slot:item.6>
          <v-form v-model="formRelationTypeValid">
            <v-alert type="info">Relation Type (Placeholder)</v-alert>
          </v-form>
        </template>
        <template v-slot:item.7>
          <v-form v-model="formVersionTemplatesValid">
            <v-alert type="info">Component Version Templates (Placeholder)</v-alert>
          </v-form>
        </template>
        <template v-slot:item.8>
          <v-form v-model="formTemplateFieldsValid">
            <v-alert type="info">Template Field Specifications (Placeholder)</v-alert>
          </v-form>
        </template>

      </v-stepper>

      <v-card-actions>
        <DefaultButton variant="text" :disabled="step === 1" @click="previous">Previous</DefaultButton>
        <v-spacer />
        <DefaultButton variant="text" color="" @click="!isDirty && cancelCreateIssueTemplate()">
                Cancel
                <ConfirmationDialog
                    v-if="isDirty"
                    :title="`Discard Issue Template?`"
                    :message="`Are you sure you want to discard this issue template?`"
                    confirm-text="Discard"
                    @confirm="cancelCreateIssueTemplate"
                />
        </DefaultButton>
        <DefaultButton variant="text" color="primary" @click="next">{{ step === stepLabels.length ? 'Create' : 'Next' }}</DefaultButton>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useForm, defineField } from 'vee-validate';
import * as yup from 'yup';
import { fieldConfig } from '@/util/vuetifyFormConfig';
import { onEvent } from '@/util/eventBus';
import { computed } from "vue";
import ConfirmationDialog from "./ConfirmationDialog.vue";
import ExpandableCard from '../ExpandableCard.vue';


import { iconList as baseIconList } from '../../assets/icons';

const createIssueTemplateDialog = ref(false);
const step = ref(1);
const stepLabels = [
  'General',
  'Issue Types, Priorities & States',
  'Assignment & Relation Types',
  'Template Field Specifications'
];




const formGeneralValid = ref(false);
const formIssueTypesValid = ref(true);
const formIssuePrioritiesValid = ref(true);
const formIssueStatesValid = ref(true);
const formAssignmentTypeValid = ref(true);
const formRelationTypeValid = ref(true);
const formVersionTemplatesValid = ref(true);
const formTemplateFieldsValid = ref(true);

const expandedCardKey = ref<{
  nameID: string
  type: "type" | "priority" | "state"
} | null>(null)

const currentEditedName = ref<string>("");
const currentEditedDescription = ref<string>("");
const nameErrorMessage = ref<string>("");

const currentEditedValue = ref<number>(0)
const valueErrorMessage = ref<string>("")

const currentEditedIsOpen = ref<boolean>(false)

const currentEditedInverseName = ref<string>("")
const inverseNameErrorMessage = ref<string>("")

type IssueType = {
  name: string;
  description: string;
  iconPath: string;
};

type IssuePriority = {
  name: string;
  description: string;
  value: number;
};

type IssueState = {
  name: string;
  description: string;
  isOpen: boolean;
};

type AssignmentType = {
  name: string;
  description: string;
};

type RelationType = {
  name: string;
  inverseName: string
  description: string;
};

// svg-icon handling vvv
type Icon = {
  name: string
  iconPath: string
}

const iconList = ref<Icon[]>([...baseIconList])
const newIcon = ref<Icon>({ name: "", iconPath: "" })
const activeTab = ref("select")
const selectedIcon = ref<Icon | null>(null)

function selectIcon(icon: Icon) {
  selectedIcon.value = icon
}

function wrappedSvg(path: string): string {
  return `
    <svg xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 100 100"
         fill="currentColor"
         width="32"
         height="32">
      <path d="${path}" />
    </svg>`
}

const iconSearch = ref("")

const filteredIcons = computed(() => {
  if (!iconSearch.value) return iconList.value
  return iconList.value.filter(icon =>
    icon.name.toLowerCase().startsWith(iconSearch.value.toLowerCase())
  )
})

function confirmAddIcon() {
  if (newIcon.value.name && newIcon.value.iconPath) {
    iconList.value.push({ ...newIcon.value })
    selectedIcon.value = { ...newIcon.value }
    newIcon.value = { name: "", iconPath: "" }
    activeTab.value = "select"
  }
}

// svg-icon handling ^^^

const issueTypes = ref<IssueType[]>([
    { name: "Bug", description: "A bug in the system", iconPath: "M 50 15.625 C 58.6294 15.625 65.625 22.6206 65.625 31.25 C 65.625 32.3199 65.5175 33.3648 65.3126 34.3742 C 65.7837 34.7252 66.2367 35.107 66.6666 35.513 L 77.6114 25.7893 L 81.7636 30.4607 L 70.2836 40.6668 C 71.1084 42.5697 71.5656 44.669 71.5656 46.875 C 71.5656 47.6383 71.5096 48.4002 71.3984 49.1547 L 84.934 51.6129 L 83.816 57.7621 L 70.191 55.2813 L 68.3254 64.6063 L 80.5257 79.2494 L 75.7243 83.2506 L 65.7441 71.2773 C 62.9055 75.4551 58.1234 78.125 52.8156 78.125 L 47.1844 78.125 C 41.8752 78.125 37.0921 75.4537 34.2537 71.2742 L 24.2757 83.2506 L 19.4743 79.2494 L 31.6722 64.6063 L 29.8066 55.2813 L 16.184 57.7621 L 15.066 51.6129 L 28.6015 49.1561 C 28.16 46.1813 28.594 43.2594 29.7194 40.6663 L 18.2364 30.4607 L 22.3886 25.7893 L 33.3272 35.5161 C 33.7582 35.1081 34.2134 34.7237 34.6913 34.3653 C 34.4821 33.3608 34.375 32.3179 34.375 31.25 C 34.375 22.6206 41.3706 15.625 50 15.625 Z M 64.5719 43.2094 L 64.3533 42.7331 C 64.3059 42.6369 64.2569 42.5417 64.2063 42.4474 L 64.3525 42.7314 C 64.273 42.5703 64.189 42.4119 64.1007 42.2562 L 64.2063 42.4474 C 64.1192 42.2852 64.0274 42.1258 63.9313 41.9695 L 64.1007 42.2562 C 64.0111 42.0981 63.9169 41.943 63.8185 41.7908 L 63.9313 41.9695 C 63.8472 41.8328 63.7597 41.6984 63.6689 41.5665 L 63.8185 41.7908 C 63.6999 41.6073 63.575 41.4282 63.4441 41.2538 L 63.6689 41.5665 C 63.5677 41.4195 63.4625 41.2756 63.3533 41.1348 L 63.4441 41.2538 C 63.3406 41.1159 63.2334 40.9809 63.1226 40.849 L 63.3533 41.1348 C 63.2472 40.9979 63.1373 40.8641 63.0239 40.7333 L 62.6891 40.3694 L 62.6891 40.3694 C 62.4039 40.0732 62.0993 39.7958 61.7775 39.5392 C 61.724 39.4957 61.6705 39.454 61.6166 39.4129 L 61.6167 39.4138 L 61.3041 39.1849 C 61.2357 39.1371 61.1667 39.0902 61.097 39.0442 L 60.7513 38.8268 C 60.6863 38.7878 60.6208 38.7497 60.5548 38.7123 L 60.7499 38.8263 C 60.5929 38.7322 60.4329 38.6426 60.2701 38.5577 L 60.5548 38.7123 C 60.3706 38.6079 60.1825 38.5096 59.9908 38.4176 L 60.2701 38.5577 C 60.0853 38.4612 59.8968 38.3708 59.705 38.2865 L 59.7036 38.2858 L 59.4443 38.1767 C 59.4277 38.17 59.4111 38.1633 59.3945 38.1568 L 59.1603 38.0675 L 59.1603 38.0675 L 58.8726 37.9676 C 58.8497 37.9601 58.8267 37.9526 58.8038 37.9453 C 58.6626 37.9001 58.522 37.8587 58.3802 37.8206 L 58.8038 37.9453 C 58.6003 37.8801 58.3939 37.8217 58.1847 37.7703 L 57.6142 37.649 C 57.5915 37.6449 57.5688 37.6409 57.5461 37.6369 L 57.6146 37.649 C 57.4203 37.614 57.2239 37.585 57.0256 37.5621 L 57.5461 37.6369 C 57.2006 37.5773 56.8487 37.5366 56.4914 37.5159 L 55.9406 37.5 L 44.0594 37.5 C 43.7266 37.5 43.3942 37.5177 43.0637 37.553 C 43.0644 37.5579 43.0653 37.5589 43.0662 37.5599 L 42.7041 37.5985 L 42.7041 37.5985 L 42.2208 37.6821 L 42.2208 37.6821 L 41.6173 37.8233 C 41.5677 37.8366 41.5184 37.8503 41.4692 37.8644 C 41.3176 37.9078 41.1667 37.9551 41.0177 38.006 L 41.4692 37.8644 C 41.0797 37.9759 40.7023 38.1111 40.3383 38.268 L 40.2982 38.2854 C 39.9383 38.4426 39.5917 38.6211 39.2595 38.819 C 39.2046 38.8517 39.1488 38.8857 39.0934 38.9203 L 39.2595 38.819 C 39.0964 38.9162 38.9367 39.0181 38.7807 39.1244 L 39.0934 38.9203 C 38.8677 39.0613 38.6489 39.2114 38.4374 39.37 L 38.4362 39.371 L 38.3298 39.452 C 38.2937 39.4799 38.2578 39.5081 38.2221 39.5365 L 38.0364 39.6884 L 38.0364 39.6884 L 37.8278 39.8689 C 37.7845 39.9075 37.7416 39.9464 37.6991 39.9857 L 37.6144 40.0651 L 37.6144 40.0651 L 37.4567 40.2181 C 37.4071 40.2674 37.358 40.3173 37.3095 40.3677 C 37.2567 40.4226 37.2048 40.4779 37.1536 40.5337 L 37.3095 40.3677 C 37.1804 40.5019 37.0553 40.6399 36.9345 40.7813 L 37.1536 40.5337 C 37.0168 40.6829 36.885 40.8364 36.7583 40.9938 L 36.9345 40.7813 C 36.8169 40.9189 36.7034 41.0599 36.5941 41.2039 L 36.7583 40.9938 C 36.4867 41.3313 36.2387 41.6872 36.0162 42.0586 C 35.9633 42.1468 35.9124 42.2349 35.863 42.3239 C 35.8119 42.4159 35.762 42.5092 35.7138 42.6033 L 35.863 42.3239 C 35.7853 42.4637 35.7111 42.6056 35.6405 42.7494 L 35.7138 42.6033 C 35.6292 42.7683 35.5494 42.9358 35.4746 43.1058 L 35.6405 42.7494 C 35.5502 42.9332 35.4659 43.1201 35.3877 43.3099 L 35.4746 43.1058 C 35.3924 43.2927 35.3161 43.4825 35.2461 43.6749 L 35.3877 43.3099 C 34.7718 44.8039 34.5355 46.4717 34.7741 48.1703 L 34.8665 48.7136 L 35.4472 51.6125 L 36.0597 54.6875 L 37.9915 64.3386 C 38.0442 64.6022 38.1077 64.8614 38.1814 65.1157 C 38.2209 65.252 38.2632 65.3863 38.3083 65.5191 L 38.1814 65.1157 C 38.2254 65.2674 38.273 65.4173 38.3241 65.5654 L 38.3083 65.5191 C 38.3642 65.6838 38.4244 65.8462 38.4889 66.0063 L 38.3241 65.5654 C 39.5533 69.1254 42.8239 71.6349 46.6292 71.8587 L 47.1844 71.875 L 52.8156 71.875 C 56.8837 71.875 60.4369 69.2611 61.7027 65.4866 C 61.7696 65.2871 61.8299 65.085 61.8837 64.8798 L 62.0085 64.3386 L 62.9993 59.375 L 63.0004 59.3719 L 65.1335 48.7136 C 65.2546 48.1082 65.3156 47.4924 65.3156 46.875 C 65.3156 45.7655 65.1228 44.701 64.769 43.7132 L 64.5719 43.2094 L 64.5719 43.2094 Z M 50 21.875 C 44.8223 21.875 40.625 26.0723 40.625 31.25 L 40.6377 31.6292 C 40.7562 31.6026 40.8754 31.5774 40.9951 31.5534 C 42.0041 31.3516 43.0305 31.25 44.0594 31.25 L 55.9406 31.25 C 57.1161 31.25 58.2613 31.3798 59.3626 31.6259 L 59.375 31.25 L 59.375 31.25 C 59.375 26.0723 55.1777 21.875 50 21.875 Z" },
    { name: "Feature", description: "A new feature", iconPath: "m 40.625 81.25 h 18.75 v 6.25 h -18.75 z m 0 -9.375 h 18.75 v 6.25 H 40.625 Z M 50 12.5 c -15.496 0 -28.125 12.629 -28.125 28.125 c 0 15.496 12.629 28.125 28.125 28.125 c 15.496 0 28.125 -12.629 28.125 -28.125 c 0 -15.496 -12.629 -28.125 -28.125 -28.125 z m 0 6.25 c 12.1182 0 21.875 9.7568 21.875 21.875 c 0 12.1182 -9.7568 21.875 -21.875 21.875 c -12.1182 0 -21.875 -9.7568 -21.875 -21.875 c 0 -12.1182 9.7568 -21.875 21.875 -21.875 z" },
    { name: "Misc", description: "Miscellaneous", iconPath:"m 46.875 62.5 h 6.25 v 6.25 h -6.25 z m 0 -31.25 h 6.25 v 25 H 46.875 Z M 50 15.625 C 31.0522 15.625 15.625 31.0522 15.625 50 C 15.625 68.9478 31.0522 84.375 50 84.375 C 68.9478 84.375 84.375 68.9478 84.375 50 C 84.375 31.0522 68.9478 15.625 50 15.625 Z m 0 6.25 c 15.57 0 28.125 12.555 28.125 28.125 c 0 15.57 -12.555 28.125 -28.125 28.125 c -15.57 0 -28.125 -12.555 -28.125 -28.125 c 0 -15.57 12.555 -28.125 28.125 -28.125 z" },
    { name: "Task", description: "A task", iconPath: "m 46.875 62.5 h 6.25 v 6.25 h -6.25 z m 0 -31.25 h 6.25 v 25 H 46.875 Z M 50 15.625 C 31.0522 15.625 15.625 31.0522 15.625 50 C 15.625 68.9478 31.0522 84.375 50 84.375 C 68.9478 84.375 84.375 68.9478 84.375 50 C 84.375 31.0522 68.9478 15.625 50 15.625 Z m 0 6.25 c 15.57 0 28.125 12.555 28.125 28.125 c 0 15.57 -12.555 28.125 -28.125 28.125 c -15.57 0 -28.125 -12.555 -28.125 -28.125 c 0 -15.57 12.555 -28.125 28.125 -28.125 z" }
]);
const issuePriorities = ref<IssuePriority[]>([
  { name: "High", description: "High priority", value: 3 },
  { name: "Low", description: "Low priority", value: 1, },
  { name: "Medium", description: "Medium priority", value: 2 },
])
const issueStates = ref<IssueState[]>([
  { name: "Completed", description: "The issue is completed", isOpen: false },
  { name: "Not planned", description: "The issue is not planned", isOpen: false},
  { name: "Open", description: "The issue is open", isOpen: true },
]);
const assignmentTypes = ref<AssignmentType[]>([
])
const relationTypes = ref<RelationType[]>([
  { name: "Depends on", inverseName: "Depended on by", description: "Depends on another issue" },
  { name: "Duplicate", inverseName: "Duplicate", description: "Is a duplicate of another issue" },
  { name: "Part of", inverseName: "Has part", description: "Is part of another issue" }
])


//function used to both add and confirm issueTypes. Previus Name and newName used to edit an issueType without creating a new one.
function createIssueType(previousName: string, newName: string, description: string, iconPath: string) {
  if((newName.trim().length === 0) && (previousName.trim().length !== 0)){
    nameErrorMessage.value = "Name is required"
    return
  }
  if(previousName.trim().toLowerCase() !== newName.trim().toLowerCase()){ {
    if(issueTypes.value.some((item) => item.name.trim().toLowerCase() === newName.trim().toLowerCase())){
    nameErrorMessage.value = "Name already exists"
    return
    } else {
      nameErrorMessage.value = ""
    }
  }
  }
  

  // Used to edit an issueType: We delete the previous issueType and push with new values again.
  deleteIssueTypeByName(previousName) 
  issueTypes.value.push({name: newName, description: description, iconPath: iconPath})

  issueTypes.value.sort((a, b) => a.name.localeCompare(b.name));
  expandedCardKey.value = null
  selectedIcon.value = null
  currentEditedName.value = ""
  currentEditedDescription.value = ""

  //console.log(issueTypes.value);
}

function deleteIssueTypeByName(nameToDelete: string) {
  issueTypes.value = issueTypes.value.filter(t => t.name !== nameToDelete)
}

function createIssuePriority(previousName: string, newName: string, description: string, value: number) {
  if ((newName.trim().length === 0) && (previousName.trim().length !== 0)) {
    nameErrorMessage.value = "Name is required"
    return
  }
  if (previousName.trim().toLowerCase() !== newName.trim().toLowerCase()) {
    if (issuePriorities.value.some((item) => item.name.trim().toLowerCase() === newName.trim().toLowerCase())) {
      nameErrorMessage.value = "Name already exists"
      return
    } else {
      nameErrorMessage.value = ""
    }
  }

  if (value === null && previousName.trim() !== "") {
    valueErrorMessage.value = "Value is required"
    return
  } else if (typeof value !== "number") {
    valueErrorMessage.value = "Value must be a number"
    return
  } else {
    valueErrorMessage.value = ""
  }

  // Replace old priority with new one
  deleteIssuePriorityByName(previousName)
  issuePriorities.value.push({ name: newName, description, value })

  issuePriorities.value.sort((a, b) => a.name.localeCompare(b.name))
  expandedCardKey.value = null
  currentEditedName.value = ""
  currentEditedDescription.value = ""
  currentEditedValue.value = 0

  console.log(issuePriorities.value)
  
}

function deleteIssuePriorityByName(nameToDelete: string) {
  issuePriorities.value = issuePriorities.value.filter(p => p.name !== nameToDelete)
}
  


function createIssueState(previousName: string, newName: string, description: string, isOpen: boolean) {
  if ((newName.trim().length === 0) && (previousName.trim().length !== 0)) {
    nameErrorMessage.value = "Name is required"
    return
  }
  if (previousName.trim().toLowerCase() !== newName.trim().toLowerCase()) {
    if (issueStates.value.some((item) => item.name.trim().toLowerCase() === newName.trim().toLowerCase())) {
      nameErrorMessage.value = "Name already exists"
      return
    } else {
      nameErrorMessage.value = ""
    }
  }

  // Replace old state with new one
  deleteIssueStateByName(previousName)
  issueStates.value.push({ name: newName, description, isOpen })

  issueStates.value.sort((a, b) => a.name.localeCompare(b.name))
  expandedCardKey.value = null
  currentEditedName.value = ""
  currentEditedDescription.value = ""
  currentEditedIsOpen.value = false

  //console.log(issueStates.value)
}

function deleteIssueStateByName(nameToDelete: string) {
  issueStates.value = issueStates.value.filter(s => s.name !== nameToDelete)
}

function createAssignmentType(previousName: string, newName: string, description: string) {
  if ((newName.trim().length === 0) && (previousName.trim().length !== 0)) {
    nameErrorMessage.value = "Name is required"
    return
  }
  if (previousName.trim().toLowerCase() !== newName.trim().toLowerCase()) {
    if (issueStates.value.some((item) => item.name.trim().toLowerCase() === newName.trim().toLowerCase())) {
      nameErrorMessage.value = "Name already exists"
      return
    } else {
      nameErrorMessage.value = ""
    }
  }

  // Replace old state with new one
  deleteAssignmentTypeByName(previousName)
  assignmentTypes.value.push({ name: newName, description })

  assignmentTypes.value.sort((a, b) => a.name.localeCompare(b.name))
  expandedCardKey.value = null
  currentEditedName.value = ""
  currentEditedDescription.value = ""

  //console.log(issueStates.value)
}

function deleteAssignmentTypeByName(nameToDelete: string) {
  assignmentTypes.value = assignmentTypes.value.filter(s => s.name !== nameToDelete)
}

function createRelationType(previousName: string, newName: string, inverseName: string, description: string) {
  if ((newName.trim().length === 0) && (previousName.trim().length !== 0)) {
    nameErrorMessage.value = "Name is required"
    return
  }
  if (previousName.trim().toLowerCase() !== newName.trim().toLowerCase()) {
    if (issueStates.value.some((item) => item.name.trim().toLowerCase() === newName.trim().toLowerCase())) {
      nameErrorMessage.value = "Name already exists"
      return
    } else {
      nameErrorMessage.value = ""
    }
  }

  if (inverseName.trim().length === 0 && previousName.trim().length !== 0) {
    inverseNameErrorMessage.value = "Inverse Name is required"
    return
  } else {
    inverseNameErrorMessage.value = ""
  }

  // Replace old state with new one
  deleteRelationTypeByName(previousName)
  relationTypes.value.push({ name: newName, inverseName, description })

  relationTypes.value.sort((a, b) => a.name.localeCompare(b.name))
  expandedCardKey.value = null
  currentEditedName.value = ""
  currentEditedDescription.value = ""
  currentEditedInverseName.value = ""

  //console.log(issueStates.value)
}

function deleteRelationTypeByName(nameToDelete: string) {
  relationTypes.value = relationTypes.value.filter(s => s.name !== nameToDelete)
}

function cancelCreateCard(){
  expandedCardKey.value = null
  nameErrorMessage.value = ""
  inverseNameErrorMessage.value = ""
  valueErrorMessage.value = ""
  deleteIssueTypeByName("")
  deleteIssuePriorityByName("")
  deleteIssueStateByName("")
  deleteAssignmentTypeByName("")
  deleteRelationTypeByName("")
}




const schema = yup.object({
  templateName: yup.string().required("Name is required"),
  templateDescription: yup.string().optional(),
  repositoryURL: yup.string().optional()

});

const { defineField, resetForm, handleSubmit, meta, validate } = useForm({
    validationSchema: schema,
});

const [templateName, templateNameProps] = defineField('templateName', fieldConfig);
const [templateDescription, templateDescriptionProps] = defineField('templateDescription', fieldConfig);
const [repositoryURL, repositoryURLProps] = defineField('repositoryURL', fieldConfig);
const [issueTypeName, issueTypeNameProps ] = defineField('issueTypeName', fieldConfig);

onEvent("create-issue-template", () => {
    resetForm();
    createIssueTemplateDialog.value = true;
    step.value = 1;
});

function next() {
  if (step.value === 1) {
    if (!meta.value.valid) {
      validate();
      return;
    }
  }
  if (step.value < stepLabels.length) {
    step.value++;
  } else {
    // Submit logic goes here
    console.log('Submit issue template');
    createIssueTemplateDialog.value = false;
  }
}

function previous() {
  if (step.value > 1) step.value--;
}

function cancelCreateIssueTemplate() {
    createIssueTemplateDialog.value = false;
}

const isDirty = computed(() => {
    return step.value > 1 || meta.value.dirty;
});





</script>

<style scoped>
.pa-3 {
  padding: 1rem;
}

.icon-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  max-width: 260px;
  max-height: 200px;
  overflow-y: auto;

  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  background-color: rgb(var(--v-theme-elevation));
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  cursor: pointer;
  border: 1px solid transparent;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-wrapper:hover {
  border-color: #bbb;
  background-color: #f0f0f0;
}

.icon-wrapper.selected {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.3);
}
</style>
