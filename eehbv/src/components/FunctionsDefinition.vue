<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card v-for="(func, index) in value" :key="index">
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="10">Funktion: {{ func.description }}</v-col>
                  <v-col cols="2">
                    <v-icon small class="mr-2" @click="editFunction(index)">mdi-pencil</v-icon>
                    <v-icon small @click="deleteFunction(index)">mdi-delete</v-icon>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-spacer></v-spacer>
        <v-btn color="green" @click="editFunction(-1)"><v-icon>mdi-plus</v-icon></v-btn>
      </v-row>
    </v-container>

    <DialogCardEditor v-model="dialogEditFunction" @save="saveFunction" @close="closeEditFunction" :title="functionEditTitle"
            :info-button="true" @info="infoFunctionOverlay = true" >
      <v-row>
        <v-col cols="6">
          <v-text-field v-model="currentFunction.description" :label="$t('variants_definition.labels.description')"
                        :error-messages="descErrors"
                        @input="$v.currentFunction.description.$touch" @blur="$v.currentFunction.description.$touch"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-textarea v-model="currentFunction.func" :label="$t('variants_definition.labels.python_function')"
                      placeholder="def target_func(a, b):\n   return a * b" :error-messages="funcErrors"
                      @input="$v.currentFunction.func.$touch" @blur="$v.currentFunction.func.$touch"></v-textarea>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-textarea v-model="currentFunction.doc" placeholder="a: width / mm, b: height / mm"
                      :label="$t('variants_definition.labels.function_doc')"></v-textarea>
        </v-col>
      </v-row>
    </DialogCardEditor>

    <DialogDelete v-model="dialogDeleteFunction" @abort="closeDeleteFunction" @delete="deleteFunctionConfirm"></DialogDelete>

    <v-overlay :opacity="0.9" :value="infoFunctionOverlay" z-index="3000">
      <v-container>
        <div v-html="$t('process_creation.info.add_function')"></div>
      </v-container>
      <v-btn color="orange lighten-2" @click="infoFunctionOverlay = false">{{$t('general.dialog.close')}}</v-btn>
    </v-overlay>

  </div>
</template>

<script>
import DialogCardEditor from "./DialogCardEditor";
import DialogDelete from "./DialogDelete";
import { required, maxLength } from "vuelidate/lib/validators";
export default {
  name: "FunctionsDefinition",
  components: {DialogDelete, DialogCardEditor},

  validations: {
    currentFunction: {
      description: { required, maxLength: maxLength(30) },
      func: { required }
    }
  },

  data: () => ({
    dialogEditFunction: false,
    dialogDeleteFunction: false,
    infoFunctionOverlay: false,
    currentFunction: { description: '', func: '', doc: '' },
    currentFunctionIndex: -1
  }),

  props: {
    value: {
      type: Array,
      required: true
    }
  },

  computed: {
    functionEditTitle() {
      return this.currentFunctionIndex < 0 ? this.$t('general.editing.create') : this.$t('general.editing.edit');
    },
    descErrors() {
      let errors = [];
      if (!this.$v.currentFunction.description.$dirty) return errors;
      !this.$v.currentFunction.description.required && errors.push(this.$t('general.validation.required'));
      !this.$v.currentFunction.description.maxLength && errors.push(this.$t('general.validation.max30'));
      return errors;
    },
    funcErrors() {
      let errors = [];
      if (!this.$v.currentFunction.func.$dirty) return errors;
      !this.$v.currentFunction.func.required && errors.push(this.$t('general.validation.required'));
      return errors;
    }
  },

  methods: {
    editFunction(index) {
      this.currentFunctionIndex = index;
      this.currentFunction = Object.assign({},
          index < 0 ?
              { description: '', func: '', doc: '' } :
              this.value[index]);
      this.dialogEditFunction = true;
    },
    saveFunction() {
      this.$v.currentFunction.$touch();
      if (this.$v.currentFunction.$invalid) {
        return;
      }
      if (this.currentFunctionIndex < 0) {
        this.value.push(this.currentFunction);
      } else {
        this.value.splice(this.currentFunctionIndex, 1, this.currentFunction);
      }
      this.closeEditFunction();
    },
    closeEditFunction() {
      this.currentFunctionIndex = -1;
      this.dialogEditFunction = false;
    },
    deleteFunction(index) {
      this.currentFunctionIndex = index;
      this.dialogDeleteFunction = true;
    },
    deleteFunctionConfirm() {
      this.value.splice(this.currentFunctionIndex, 1);
      this.closeDeleteFunction();
    },
    closeDeleteFunction() {
      this.dialogDeleteFunction = false;
    }
  }
}
</script>

<style scoped>

</style>