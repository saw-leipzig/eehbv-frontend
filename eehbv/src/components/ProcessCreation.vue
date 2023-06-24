<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12"><h2>{{$t("process_creation.titles.new_process")}}</h2></v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-stepper v-model="def_step">
            <v-stepper-header>
              <v-stepper-step :complete="def_step > 1" color="green" step="1" @click="jumpStep(1)">
                {{$t("process_creation.labels.process_definition")}}
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="def_step > 2" color="green" step="2" @click="jumpStep(2)">
                {{$t("process_creation.labels.functions")}}
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="def_step > 3" color="green" step="3" @click="jumpStep(3)">
                {{$t("process_creation.labels.variants_definition")}}
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="def_step > 4" step="4" color="green" @click="jumpStep(4)">
                {{$t("process_creation.labels.variant_selection_definition")}}
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="def_step > 5" step="5" color="green" @click="jumpStep(5)">
                {{$t("process_creation.labels.solver_definition")}}
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step step="6" color="green" @click="jumpStep(6)">
                {{$t("process_creation.labels.info_texts_definition")}}
              </v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content step="1">
                <EditNewWrapper :context-new="true" :info-text="info[0]" :disabled="disabledProcess"
                                :title="$t('process_creation.titles.process_definition')" @ok="continueOne" @abort="abort">
                  <ProcessDefinition v-model="process" :processes="processes"></ProcessDefinition>
                </EditNewWrapper>
              </v-stepper-content>

              <v-stepper-content step="2">
                <EditNewWrapper :context-new="true" :info-text="info[1]" :disabled="disabledFunctions"
                                :title="$t('process_creation.labels.functions')" @ok="continueTwo" @abort="abort">
                  <FunctionsDefinition v-model="functions"></FunctionsDefinition>
                </EditNewWrapper>
              </v-stepper-content>

              <v-stepper-content step="3">
                <EditNewWrapper :context-new="true" :info-text="info[2]" :disabled="disabledVariants"
                                :title="$t('process_creation.titles.variants_definition')" @ok="continueThree" @abort="abort">
                  <VariantsDefinition v-model="variants" :process="process" :loss_functions="functions"></VariantsDefinition>
                </EditNewWrapper>
              </v-stepper-content>

              <v-stepper-content step="4">
                <EditNewWrapper :context-new="true" :info-text="info[3]"
                                :title="process.variant_tree ? $t('process_creation.titles.variant_selection_definition_tree') : $t('process_creation.titles.variant_selection_definition_list')"
                                @ok="continueFour" @abort="abort">
                  <VariantSelectionDefinition v-model="variant_selection" :variants="variants" :process="process"></VariantSelectionDefinition>
                </EditNewWrapper>
              </v-stepper-content>

              <v-stepper-content step="5">
                <EditNewWrapper :context-new="true" :info-text="info[4]" @ok="continueFive" @abort="abort">
                  <SolverDefinition v-model="solver"></SolverDefinition>
                </EditNewWrapper>
              </v-stepper-content>

              <v-stepper-content step="6">
                <EditNewWrapper :context-new="true" :info-text="info[5]"
                                :title="$t('process_creation.titles.info_texts_definition')"
                                @ok="continueSix" @abort="abort">
                  <InfoTextsDefinition v-model="infoTexts"></InfoTextsDefinition>
                </EditNewWrapper>
              </v-stepper-content>

            </v-stepper-items>
          </v-stepper>
        </v-col>
      </v-row>
    </v-container>

    <DialogDelete v-model="dialogInfoJump" :show-abort="false" @delete="dialogInfoJump = false" delete-btn-text="OK"
                  title="Löschen oder ändern Sie keine Einträge, die bereits genutzt werden!"></DialogDelete>
  </div>
</template>

<script>
import EditNewWrapper from "./EditNewWrapper";
import ProcessDefinition from "./ProcessDefinition";
import VariantsDefinition from "./VariantsDefinition";
import VariantSelectionDefinition from "./VariantSelectionDefinition";
import SolverDefinition from "./SolverDefinition";
import InfoTextsDefinition from "./InfoTextsDefinition";
import ParameterDependencyDefinition from "./ParameterDependencyDefinition";
import FunctionsDefinition from "./FunctionsDefinition";
import {mapGetters} from "vuex";
import DialogDelete from "./DialogDelete";
const snake = /^[a-z_]*$/;

export default {
  name: "ProcessCreation",
  components: {
    DialogDelete,
    FunctionsDefinition,
    ParameterDependencyDefinition,
    InfoTextsDefinition,
    VariantSelectionDefinition, SolverDefinition, VariantsDefinition, ProcessDefinition, EditNewWrapper},
  data () {
    return {
      dialogInfoJump: false,
      def_step: 1,
      max_step: 1,
      process: {
        view_name: '',
        api_name: '',
        variant_tree: false,
        process_parameters: []
      },
      functions: [],
      variants: [],
      variant_selection: {
        list: [],
        tree: [{
          id: 'root',
          question: '',
          info: '',
          excludes: [],
          exclude_choices: [],
          answers: [
              { response: 'yes', question: '', excludes: [], exclude_choices: [], id: 'y', answers: [] },
              { response: 'no', question: '', excludes: [], exclude_choices: [], id: 'n', answers: []}
          ]
        }]
      },
      solver: { code: '', use_solver: false },
      infoTexts: [ {type: 1, type_id: null, position: 3, text: ''}, {type: 1, type_id: null, position: 4, text: ''} ],
      info: [
          this.$t("process_creation.info.definition"),
          this.$t("process_creation.info.functions"),
          this.$t("process_creation.info.variants"),
          this.$t("process_creation.info.selection"),
          this.$t("process_creation.info.solver"),
          this.$t("process_creation.info.infoTexts")
      ],
      varTesting: true
    }
  },

  created() {
    if (this.process.length < 1) {
      this.$store.dispatch('initProcesses');
    }

    if (this.varTesting) {  // Test variant selection settings, predefined data
      this.process = Object.assign({},{
        api_name: 'edge_banding_test', variant_tree: false, view_name: 'Kantenanleimmaschine_Test',
        process_parameters: [
          {
            "name": "Vorschubgeschwindigkeit",
            "variable_name": "p_feed_speed",
            "unit": "m / min",
            "material_properties_id": null,
            "defaults": "",
            "general": false
          },
          {
            "name": "Werkstückdicke",
            "variable_name": "p_width",
            "unit": "mm",
            "material_properties_id": null,
            "defaults": "",
            "general": false
          },
          {
            "name": "Werkstücklänge",
            "variable_name": "p_length",
            "unit": "cm",
            "material_properties_id": null,
            "defaults": "",
            "general": false
          },
          {
            "name": "Breite Kantenband",
            "variable_name": "p_width_band",
            "unit": "mm",
            "material_properties_id": null,
            "defaults": "",
            "general": false
          },
          {
            "name": "Dicke Kantenband",
            "variable_name": "p_thickness_band",
            "unit": "mm",
            "material_properties_id": null,
            "defaults": "",
            "general": false
          },
          {
            "name": "Werkstücklücke",
            "variable_name": "p_gap",
            "unit": "cm",
            "material_properties_id": null,
            "defaults": "",
            "general": false
          },
          {
            "name": "Abnutzungsfaktor Fräsen",
            "variable_name": "p_wear_factor",
            "unit": "",
            "material_properties_id": null,
            "defaults": "",
            "general": false
          },
          {
            "name": "Spez. Schnittkraftkonstante",
            "variable_name": "p_kc05",
            "unit": "N/mm^1.5",
            "material_properties_id": 2,
            "defaults": "",
            "general": false
          },
          {
            "name": "Spez. Schnittkraftkonst. Band",
            "variable_name": "p_kc05_band",
            "unit": "N/mm^1.5",
            "material_properties_id": 2,
            "defaults": "",
            "general": false
          },
          {
            "name": "Zahnzahl Vorfräse",
            "variable_name": "p_pre_teeth",
            "unit": "",
            "material_properties_id": null,
            "defaults": "3",
            "general": false
          },
          {
            "name": "Frästiefe Vorfräse",
            "variable_name": "p_pre_depth",
            "unit": "mm",
            "material_properties_id": null,
            "defaults": "3",
            "general": false
          },
          {
            "name": "Winkel kappa Vorfräse",
            "variable_name": "p_pre_ang_kappa",
            "unit": "°",
            "material_properties_id": null,
            "defaults": "90",
            "general": false
          },
          {
            "name": "Winkel lambda Vorfräse",
            "variable_name": "p_pre_ang_lambda",
            "unit": "°",
            "material_properties_id": null,
            "defaults": "65",
            "general": false
          },
          {
            "name": "Drehzahl Vorfräse",
            "variable_name": "p_pre_n",
            "unit": "1/min",
            "material_properties_id": null,
            "defaults": "9000",
            "general": false
          },
          {
            "name": "Werkzeugdurchm. Vorfräse",
            "variable_name": "p_pre_diameter",
            "unit": "mm",
            "material_properties_id": null,
            "defaults": "125",
            "general": false
          },
          {
            "name": "Zahnzahl Kappsäge",
            "variable_name": "p_trim_teeth",
            "unit": "",
            "material_properties_id": null,
            "defaults": "24",
            "general": false
          },
          {
            "name": "Winkel kappa Kappsäge",
            "variable_name": "p_trim_ang_kappa",
            "unit": "°",
            "material_properties_id": null,
            "defaults": "65",
            "general": false
          },
          {
            "name": "Winkel lambda Kappsäge",
            "variable_name": "p_trim_ang_lambda",
            "unit": "°",
            "material_properties_id": null,
            "defaults": "5",
            "general": false
          },
          {
            "name": "Drehzahl Kappsäge",
            "variable_name": "p_trim_n",
            "unit": "1/min",
            "material_properties_id": null,
            "defaults": "12000",
            "general": false
          },
          {
            "name": "Werkzeugdurchm. Kappsäge",
            "variable_name": "p_trim_diameter",
            "unit": "mm",
            "material_properties_id": null,
            "defaults": "120",
            "general": false
          },
          {
            "name": "Blattdicke Kappsäge",
            "variable_name": "p_trim_width",
            "unit": "mm",
            "material_properties_id": null,
            "defaults": "3.2",
            "general": false
          },
          {
            "name": "Winkel Führung Kappsäge",
            "variable_name": "p_trim_angle",
            "unit": "°",
            "material_properties_id": null,
            "defaults": "45",
            "general": true
          },
          {
            "name": "Zahnzahl Bündigfräser",
            "variable_name": "p_flush_teeth",
            "unit": "",
            "material_properties_id": null,
            "defaults": "3",
            "general": false
          },
          {
            "name": "Winkel kappa Bündigfräser",
            "variable_name": "p_flush_ang_kappa",
            "unit": "°",
            "material_properties_id": null,
            "defaults": "90",
            "general": false
          },
          {
            "name": "Winkel lambda Bündigfräser",
            "variable_name": "p_flush_ang_lambda",
            "unit": "°",
            "material_properties_id": null,
            "defaults": "65",
            "general": false
          },
          {
            "name": "Drehzahl Bündigfräse",
            "variable_name": "p_flush_n",
            "unit": "1/min",
            "material_properties_id": null,
            "defaults": "12000",
            "general": false
          },
          {
            "name": "Werkzeugdurchm. Bündigfräser",
            "variable_name": "p_flush_diameter",
            "unit": "mm",
            "material_properties_id": null,
            "defaults": "80",
            "general": false
          },
          {
            "name": "Zahnzahl Radienfräser",
            "variable_name": "p_round_teeth",
            "unit": "",
            "material_properties_id": null,
            "defaults": "4",
            "general": false
          },
          {
            "name": "Fräsradius Radienfräser",
            "variable_name": "p_round_radius",
            "unit": "mm",
            "material_properties_id": null,
            "defaults": "",
            "general": false
          },
          {
            "name": "Werkzeugdurchm. Radienfräser",
            "variable_name": "p_round_diameter",
            "unit": "mm",
            "material_properties_id": null,
            "defaults": "125",
            "general": false
          },
          {
            "name": "Einstellwinkel Ziehklinge",
            "variable_name": "p_scraper_ang",
            "unit": "°",
            "material_properties_id": null,
            "defaults": "90",
            "general": true
          },
          {
            "name": "Eingriff Ziehklinge",
            "variable_name": "p_scraper_depth",
            "unit": "mm",
            "material_properties_id": null,
            "defaults": "0.2",
            "general": true
          },
          {
            "name": "Spannfederpunkt x1",
            "variable_name": "p_feed_x1",
            "unit": "m",
            "material_properties_id": null,
            "defaults": "",
            "general": true
          },
          {
            "name": "Spannfederpunkt y1",
            "variable_name": "p_feed_y1",
            "unit": "m",
            "material_properties_id": null,
            "defaults": "",
            "general": true
          },
          {
            "name": "Spannfederpunkt x3",
            "variable_name": "p_feed_x3",
            "unit": "m",
            "material_properties_id": null,
            "defaults": "",
            "general": true
          },
          {
            "name": "Spannfederpunkt y3",
            "variable_name": "p_feed_y3",
            "unit": "m",
            "material_properties_id": null,
            "defaults": "",
            "general": true
          },
          {
            "name": "Federkonstante Spannfedern",
            "variable_name": "p_feed_kc",
            "unit": "N/m",
            "material_properties_id": null,
            "defaults": "49660",
            "general": true
          },
          {
            "name": "Reibungskoeffizient Förderband",
            "variable_name": "p_feed_mu",
            "unit": "",
            "material_properties_id": null,
            "defaults": "6",
            "general": true
          },
          {
            "name": "Transferbandlänge",
            "variable_name": "p_feed_l",
            "unit": "m",
            "material_properties_id": null,
            "defaults": "6.5",
            "general": true
          },
          {
            "name": "Abstand Band-Federelemente",
            "variable_name": "p_feed_spring_dist",
            "unit": "m",
            "material_properties_id": null,
            "defaults": "0.07",
            "general": true
          },
          {
            "name": "Spannweg Werkstück",
            "variable_name": "p_feed_delta_x",
            "unit": "m",
            "material_properties_id": null,
            "defaults": "0.004",
            "general": true
          },
          {
            "name": "Vorspannung Band-Spannfeder",
            "variable_name": "p_feed_f0",
            "unit": "N",
            "material_properties_id": null,
            "defaults": "200",
            "general": true
          },
          {
            "name": "Durchmesser Riemenscheiben",
            "variable_name": "p_feed_disc_diam",
            "unit": "m",
            "material_properties_id": null,
            "defaults": "0.2",
            "general": true
          }
        ]
      });
      this.variants.push(...[
        {
          "name": "Var 1",
          "variant_components": [
            {
              "position": 0,
              "component_api_name": "motors",
              "variable_name": "c_pre_motor",
              "description": "Vorfräsmotor"
            },
            {
              "position": 1,
              "component_api_name": "transformers",
              "variable_name": "c_pre_converter",
              "description": "Vorfräsumrichter"
            },
            {
              "position": 2,
              "component_api_name": "motors",
              "variable_name": "c_trim_motor",
              "description": "Kappmotor"
            },
            {
              "position": 3,
              "component_api_name": "transformers",
              "variable_name": "c_trim_converter",
              "description": "Kappumrichter"
            },
            {
              "position": 4,
              "component_api_name": "motors",
              "variable_name": "c_flush_motor",
              "description": "Bündigfräsmotor"
            },
            {
              "position": 5,
              "component_api_name": "transformers",
              "variable_name": "c_flush_converter",
              "description": "Bündigfräsumrichter"
            },
            {
              "position": 6,
              "component_api_name": "motors",
              "variable_name": "c_round_motor",
              "description": "Radienfräsmotor"
            },
            {
              "position": 7,
              "component_api_name": "transformers",
              "variable_name": "c_round_converter",
              "description": "Radienfräsumrichter"
            },
            {
              "position": 8,
              "component_api_name": "gears",
              "variable_name": "c_feed_gears",
              "description": "Getriebe Bandvorschub"
            },
            {
              "position": 9,
              "component_api_name": "motors",
              "variable_name": "c_feed_motor",
              "description": "Bandvorschubmotor"
            }
          ],
          "variant_functions": [],
          "variant_restrictions": []
        }
      ]);
      this.functions.push(...[
        {
          "description": "Kantenbandüberlapp",
          "func": "def target_func(width_wp, width_band):\n    # width workpiece mm, width edge band mm\n    return (width_band - width_wp) / 2\n",
          "doc": "width workpiece mm, width edge band mm"
        },
        {
          "description": "Listenselektion",
          "func": "def target_func(list_var, index):\n    # list, index\n    return list_var[index]\n",
          "doc": "list, index"
        },
        {
          "description": "Prozesswerte Fräsen",
          "func": "import numpy as np\n\n\ndef target_func(diameter, num_teeth, ang_kappa, ang_lambda, cutting_width, depth_of_cut, kc05, rpm, feed_speed,\n                length_wp, gap_wp, r_bend, n_motors):\n    # diameter mm, num_teeth, ang_kappa °, ang_lambda ° - tool parameters, provided as process parameters\n    # cutting_width mm, depth_of_cut mm -\n    # kc05 N/mm^1,5, rpm, feed_speed m/min, length_wp cm, gap_wp cm, r_bend mm, n_motors for multiple\n    # returns list of cutting force, moment, max power, and mean power -- accessible by index starting with 0\n    milling_tool = RotatingTool(diameter=diameter, num_teeth=num_teeth, ang_kappa=ang_kappa, ang_lambda=ang_lambda,\n                                protrusion=0)\n    milling_tool.define_cutting_process(kc05=kc05, rpm=rpm, feed_speed=feed_speed, cutting_width=cutting_width,\n                                        depth_of_cut=depth_of_cut)\n    geometry_variables = milling_tool.calculate_geometry_parameters()\n    power_variables = straight_cut(diameter, num_teeth, ang_kappa, ang_lambda, cutting_width, depth_of_cut, kc05, rpm,\n                                   feed_speed) if r_bend == 0 else \\\n        bend_cut(diameter, num_teeth, ang_lambda, kc05, rpm, feed_speed, r_bend)\n    portion_load = length_wp / (length_wp + gap_wp)\n    return [*power_variables, power_variables[3] * portion_load * n_motors]\n\n\ndef straight_cut(diameter, num_teeth, ang_kappa, ang_lambda, cutting_width, depth_of_cut, kc05, rpm, feed_speed):\n    milling_tool = RotatingTool(diameter=diameter, num_teeth=num_teeth, ang_kappa=ang_kappa, ang_lambda=ang_lambda,\n                                protrusion=0)\n    milling_tool.define_cutting_process(kc05=kc05, rpm=rpm, feed_speed=feed_speed, cutting_width=cutting_width,\n                                        depth_of_cut=depth_of_cut)\n    geometry_variables = milling_tool.calculate_geometry_parameters()\n    return milling_tool.calculate_process_output(geometry_variables)\n\n\ndef bend_cut(diameter, num_teeth, ang_lambda, kc05, rpm, feed_speed, r_bend):\n    n = 10\n    xs = [r_bend * (1 - 1 / 2 / n - i / n) for i in range(n)]\n    kappa = [np.arccos(x / r_bend) for x in xs]\n    pieces = [{\"ang_kappa\": k, \"depth_of_cut\": (r_bend * (1 - np.sin(k)))} for k in kappa]\n    pvs = []\n    for piece in pieces:\n        milling_tool = RotatingTool(diameter=diameter, num_teeth=num_teeth, ang_kappa=piece[\"ang_kappa\"],\n                                    ang_lambda=ang_lambda, protrusion=0)\n        milling_tool.define_cutting_process(kc05=kc05, rpm=rpm, feed_speed=feed_speed, cutting_width=r_bend / n,\n                                            depth_of_cut=piece[\"depth_of_cut\"])\n        geometry_variables = milling_tool.calculate_geometry_parameters()\n        pvs.append(milling_tool.calculate_process_output(geometry_variables))\n    return [sum([pv[0] for pv in pvs]), sum([pv[1] for pv in pvs]), sum([pv[2] for pv in pvs])]\n\n\nclass RotatingTool:\n    \"\"\"Base class for rotating cutting tools.\"\"\"\n\n    def __init__(self, diameter, num_teeth, ang_kappa, ang_lambda):\n        \"\"\"\n        Initialize a rotary cutting tool.\n\n        Parameters\n        ----------\n        diameter : float\n            tool diameter in mm.\n        num_teeth : integer\n            number of teeth.\n        ang_kappa : float\n            cutting angle in deg.\n        ang_lambda : float\n            cutting angle in deg.\n\n        Returns\n        -------\n        Object.\n\n        \"\"\"\n        self.d = diameter / 1000\n        self.z = num_teeth\n        self.ang_kap = ang_kappa * np.pi / 180\n        self.ang_lam = ang_lambda\n        self.process_params = None\n        self.ppp = False\n\n    def define_cutting_process(self, kc05, rpm, feed_speed, cutting_width,\n                               depth_of_cut, protrusion=0):\n        \"\"\"\n        Definition of a wood cutting process.\n\n        Parameters\n        ----------\n        kc05: float\n            specific cutting force of material in N/mm^1.5\n        rpm : float\n            rotations per minute.\n        feed_speed : float\n            feed speed in meters per minute.\n        cutting_width : float\n            cutting width in mm.\n        depth_of_cut : float\n            depth of cut in mm.\n        protrusion : float\n            saw blades only: blade protrusion in mm\n        Returns\n        -------\n        A dictonary of the cutting parameters.\n\n        \"\"\"\n        # check for numeric values?\n        # conversion to SI Units\n        parameter_dict = dict([(\"kc05\", kc05*1000**1.5), (\"rpm\", rpm),\n                               (\"feed_speed\", feed_speed/60),\n                               (\"cw\", cutting_width/1000),\n                               (\"ae\", depth_of_cut/1000),\n                               (\"n\", rpm/60), (\"protrusion\", protrusion/1000)])\n\n        self.process_params = parameter_dict\n        self.ppp = True\n\n    def check_process_param_dict(self):\n        \"\"\"Check if a Process Parameters Dictonary is available.\"\"\"\n        if self.ppp:\n            return self.ppp\n        else:\n            print(\"Please parse a process parameter dict \\\n                  to make this calculation.\")\n            return self.ppp\n\n    def calculate_geometry_parameters(self):\n        \"\"\"\n        Calculate specific geometry values for the given process parameters.\n\n        Returns\n        -------\n        A dictonary containing all relevant cutting process values.\n\n        \"\"\"\n        fz = self.fz()\n        vc = self.vc()\n        omega = self.angular_vel()\n        phi = self.ang_phi()\n        sb = self.sb(phi)\n        ze = self.ze(phi)\n        hm = self.hm(fz, sb)\n\n        res = dict([(\"vc\", vc), (\"feed per tooth\", fz), (\"phi\", phi),\n                    (\"cut arc length\", sb), (\"ze\", ze),\n                    (\"medium chip thickness\", hm), (\"ang_v\", omega)])\n        return res\n\n    def calculate_process_output(self, geometry_dict):\n        \"\"\"\n        Calculate cutting force, moment and power.\n\n        Returns\n        -------\n        A dictonary containing calculation results.\n\n        \"\"\"\n        Fc = self.Fc(geometry_dict.get(\"medium chip thickness\"))\n        M = self.cutting_moment(Fc, geometry_dict.get(\"ze\"))\n        P = self.cutting_power(M, geometry_dict.get(\"ang_v\"))\n\n        res = dict([(\"cutting force\", Fc), (\"cutting moment\", M),\n                    (\"cutting power\", P)])\n        \n        return [Fc, M, P]\n\n    def angular_vel(self):\n        \"\"\"Calculate the tools angular velocity.\"\"\"\n        if self.check_process_param_dict():\n            return 2 * np.pi * self.process_params.get(\"n\")\n\n    def vc(self):\n        \"\"\"Calculate the cutting speed.\"\"\"\n        if self.check_process_param_dict():\n            return self.d * np.pi / self.process_params.get(\"n\")\n\n    def fz(self):\n        \"\"\"Calculate the feed per tooth.\"\"\"\n        if self.check_process_param_dict():\n            return self.process_params.get(\"feed_speed\") / \\\n                (self.process_params.get(\"n\") * self.z)\n\n    def sb(self, ang_phi):\n        \"\"\"Arc length of tooth in cutting operation.\"\"\"\n        if self.check_process_param_dict():\n            return self.d * ang_phi * 0.5\n\n    def ze(self, ang_phi):\n        \"\"\"Calculate the number of active teeth.\"\"\"\n        if self.check_process_param_dict():\n            return self.z * ang_phi / np.pi * 0.5\n\n    def ang_phi(self):\n        \"\"\"\n        Calculate angle of operation?.\n\n        Returns\n        -------\n        Angle of operation in radians.\n\n        \"\"\"\n        if self.check_process_param_dict():\n            h1 = self.process_params.get(\"ae\") - \\\n                self.process_params.get(\"protrusion\")\n            return np.arccos(1-2*h1/self.d) - \\\n                np.arccos(1-2*self.process_params.get(\"protrusion\")/self.d)\n\n    def hm(self, feed_per_tooth, cut_arc_length):\n        \"\"\"\n        Calculate medium chip thickness.\n\n        Parameters\n        ----------\n        feed_per_tooth : float\n            feed per tooth in meters/tooth.\n        cut_arc_length : floath\n            tooth active arc length in meters.\n\n        Returns\n        -------\n        None.\n\n        \"\"\"\n        if self.check_process_param_dict():\n            return feed_per_tooth * np.sin(self.ang_kap) * \\\n                self.process_params.get(\"ae\") / cut_arc_length\n\n    def Fc(self, medium_chip_thickness):\n        \"\"\"Calculate cutting force.\"\"\"\n        return self.process_params.get(\"kc05\") * \\\n            self.process_params.get(\"cw\") /\\\n            np.sin(self.ang_kap) * np.sqrt(medium_chip_thickness)\n\n    def cutting_moment(self, cutting_force, ze):\n        \"\"\"Moment of the cutting force acting on the motor.\"\"\"\n        return ze * cutting_force * self.d * 0.5\n\n    def cutting_power(self, moment, angular_vel):\n        \"\"\"Power of the cutting motor.\"\"\"\n        return moment * angular_vel\n",
          "doc": "diameter mm, num_teeth, ang_kappa °, ang_lambda ° - tool parameters, provided as process parameters\ncutting_width mm, depth_of_cut mm -\nkc05 N/mm^1,5, rpm, feed_speed m/min, length_wp cm, gap_wp cm, r_bend mm, n_motors for multiple\nreturns list of cutting force, moment, max power, and mean power -- accessible by index starting with 0"
        },
        {
          "description": "Motorwärmeleistung",
          "func": "from statistics import mean\n\n\ndef target_func(coeff_a, coeff_b, coeff_c, coeff_d, coeff_e, coeff_f, coeff_g, f_nominal, m_nominal, p_nominal, length, gap, f_load_abs, m_load_abs):\n    # coeff_a, coeff_b, coeff_c, coeff_d, coeff_e, coeff_f, coeff_g - efficiency coefficients of motor\n    # f_nominal 1/min, m_nominal Nm, p_nominal W - nominal rotation frequency, torque, and power of motor\n    # length cm, gap cm - length of workpiece and gap between workpieces\n    # f_load_abs 1/min, m_load_abs Nm - set rotation frequency, torque of process ; m can be list of equally to weight values (time resolved moment during load)\n    f_load = f_load_abs / f_nominal\n    f_idle = f_load\n    m_load = [load/m_nominal for load in m_load_abs] if type(m_load_abs) == list else m_load_abs / m_nominal\n    portion_load = length / (length + gap)\n    loss_load = mean([motor_loss(coeff_a, coeff_b, coeff_c, coeff_d, coeff_e, coeff_f, coeff_g, f_load, m) for m in m_load]) if type(m_load) == list else \\\n        motor_loss(coeff_a, coeff_b, coeff_c, coeff_d, coeff_e, coeff_f, coeff_g, f_load, m_load) \n    relative_loss = portion_load * loss_load + (1 - portion_load) * motor_loss(coeff_a, coeff_b, coeff_c, coeff_d, coeff_e, coeff_f, coeff_g, f_idle, 0)\n    return relative_loss * p_nominal\n\n\ndef motor_loss(coeff_a, coeff_b, coeff_c, coeff_d, coeff_e, coeff_f, coeff_g, f, m):\n    return coeff_a + coeff_b * f + coeff_c * f ** 2 + coeff_d * f * m ** 2 + coeff_e * f ** 2 * m ** 2 + coeff_f * m ** 2 + coeff_g * m\n\n\ndef motor_loss_eight(p_100_100, p_50_100, p_0_100, p_100_50, p_50_50, p_0_50, p_50_25, p_0_25, f_rel, m_rel):\n    f_z = f_rel * 100   # in %\n    m_z = m_rel * 100   # in %\n    if f_z < 0.5 and m_z < 50: # seg 3\n        return p_0_25 + f_z / 50 * (p_50_25 - p_0_25) + (m_z - 25) / 25 * (p_0_50 - p_0_25 + f_z / 50 * (p_50_50 - p_0_50 - p_50_25 + p_0_25))\n    if f_z < 0.5 and m_z >= 50: # seg 1\n        return p_0_50 + f_z / 50 * (p_50_50 - p_0_50) + (m_z - 50) / 50 * (p_0_100 - p_0_50 + f_z / 50 * (p_50_100 - p_0_100 - p_50_50 + p_0_50))\n    if f_z >= 0.5 and m_z < 50: # seg 4\n        return p_0_25 + f_z / 50 * (p_50_25 - p_0_25) + (m_z - 25) / 25 * (p_50_50 - p_0_25 + (f_z - 50) / 50 * (p_100_50 - p_50_50) - f_z / 50 * (p_50_25 - p_0_25))\n    if f_z >= 0.5 and m_z >= 50: # seg 2\n        return p_50_50 + (f_z - 50) * f_z / 50 * (p_100_50 - p_50_50) + (m_z - 50) / 50 * (p_50_100 - p_50_50 + (f_z - 50) / 50 * (p_100_100 - p_50_100 - p_100_50 + p_50_50))\n",
          "doc": "coeff_a, coeff_b, coeff_c, coeff_d, coeff_e, coeff_f, coeff_g - efficiency coefficients of motor\nf_nominal 1/min, m_nominal Nm, p_nominal W - nominal rotation frequency, torque, and power of motor\nlength cm, gap cm - length of workpiece and gap between workpieces\nf_load_abs 1/min, m_load_abs Nm - set rotation frequency, torque of process ; m can be list of equally to weight values (time resolved moment during load)"
        },
        {
          "description": "Wärmeleistung Spannungswandler",
          "func": "from statistics import mean\n\n\ndef target_func(p_90_100, p_50_100, p_0_100, p_90_50, p_50_50, p_0_50, p_50_25, p_0_25, p_nominal, f_nominal, length, gap, f_load_abs, m_load_abs, m_nominal_motor):\n    # p_x_y - relative efficieny values of motor\n    # f_nominal Hz, m_nominal Nm, p_nominal W - nominal rotation frequency, torque, and power of motor\n    # length cm, gap cm - length of workpiece and gap between workpieces\n    # f_load_abs 1/min, m_load_abs Nm - set rotation frequency, torque of process ; m can be list of equally to weight values (time resolved moment during load)\n    f_load = f_load_abs / f_nominal / 60\n    f_idle = f_load\n    i_qz_load = [load/m_nominal_motor for load in m_load_abs] if type(m_load_abs) == list else m_load_abs / m_nominal_motor\n    portion_load = length / (length + gap)\n    loss_load = mean([converter_loss(p_90_100, p_50_100, p_0_100, p_90_50, p_50_50, p_0_50, p_50_25, p_0_25, f_load, i_qz_load) for m in i_qz_load]) if type(i_qz_load) == list else \\\n        converter_loss(p_90_100, p_50_100, p_0_100, p_90_50, p_50_50, p_0_50, p_50_25, p_0_25, f_load, i_qz_load) \n    relative_loss = portion_load * loss_load + (1 - portion_load) * converter_loss(p_90_100, p_50_100, p_0_100, p_90_50, p_50_50, p_0_50, p_50_25, p_0_25, f_idle, 0)\n    return relative_loss * p_nominal\n\n\ndef converter_loss(p_90_100, p_50_100, p_0_100, p_90_50, p_50_50, p_0_50, p_50_25, p_0_25, f_rel, i_rel):\n    f_z = f_rel * 100   # in %\n    i_qz = i_rel * 100   # in %\n    if f_z < 0.5 and i_qz < 50: # seg 3\n        return p_0_25 + f_z / 50 * (p_50_25 - p_0_25) + (i_qz - 25) / 25 * (p_0_50 - p_0_25 + f_z / 50 * (p_50_50 - p_0_50 - p_50_25 + p_0_25))\n    if f_z < 0.5 and i_qz >= 50: # seg 1\n        return p_0_50 + f_z / 50 * (p_50_50 - p_0_50) + (i_qz - 50) / 50 * (p_0_100 - p_0_50 + f_z / 50 * (p_50_100 - p_0_100 - p_50_50 + p_0_50))\n    if f_z >= 0.5 and i_qz < 50: # seg 4\n        return p_0_25 + f_z / 50 * (p_50_25 - p_0_25) + (i_qz - 25) / 25 * (p_50_50 - p_0_25 + (f_z - 50) / 40 * (p_90_50 - p_50_50) - f_z / 50 * (p_50_25 - p_0_25))\n    if f_z >= 0.5 and i_qz >= 50: # seg 2\n        return p_50_50 + (f_z - 50) * f_z / 40 * (p_90_50 - p_50_50) + (i_qz - 50) / 50 * (p_50_100 - p_50_50 + (f_z - 50) / 40 * (p_90_100 - p_50_100 - p_90_50 + p_50_50))\n",
          "doc": "p_x_y - relative efficieny values of motor\np_nominal W, f_nominal Hz - nominal power and rotation frequency of motor\nlength cm, gap cm - length of workpiece and gap between workpieces\nf_load_abs 1/min, m_load_abs Nm, m_nominal Nm - set rotation frequency, torque of process, and nominal torque of motor\n-- m_load_abs can be list of equally to weight values (time resolved moment during load)"
        },
        {
          "description": "Hilfswerte Kappsäge",
          "func": "from math import tan\n\n\ndef target_func(v_feed, alpha, length, gap, width_band):\n    # v_feed m/min, alpha °, length cm, gap cm, width_band mm\n    # returns downward speed in m/min, load and idle time in arbitrary units\n    v_down = tan(alpha) * v_feed\n    t_total = (length + gap) / v_feed\n    t_load = width_band / v_down\n    t_idle = t_total - t_load\n    return [v_down, t_load, t_idle]\n",
          "doc": "v_feed m/min, alpha °, length cm, gap cm, width_band mm\nreturns downward speed in m/min, load and idle time in arbitrary units"
        },
        {
          "description": "Ziehklingenleistung",
          "func": "from math import sin, sqrt\n\n\ndef target_func(ang_kappa, kc05, feed_speed, cutting_width, depth_of_cut, length, gap):\n    # ang_kappa °, kc05 N/mm^1.5, feed_speed m /min, cutting_width mm, depth_of_cut mm,\n    # length workpiece cm, gap workpiece cm\n    power_load = feed_speed/60 * kc05*1000**1.5 * cutting_width/1000 * sqrt(depth_of_cut/1000) / sin(ang_kappa)\n    return length / (length + gap) * power_load\n",
          "doc": "ang_kappa °, kc05 N/mm^1.5, feed_speed m /min, cutting_width mm, depth_of_cut mm,\nlength workpiece cm, gap workpiece cm"
        },
        {
          "description": "Vorschubleistung",
          "func": "from math import sqrt, cos, sin, atan\n\n\ndef target_func(a, mu, k_c, f_zero, v_feed, x_1, y_1, dx, x_3, y_3, length_band, length_wp, gap_wp):\n    v_feed_si = v_feed / 60\n    return process_power(a, mu, k_c, f_zero, v_feed_si, x_1, y_1, dx, x_3, y_3, length_band, length_wp, gap_wp)\n\n\ndef process_power(a, mu, k_c, f_zero, v_feed, x_1, y_1, dx, x_3, y_3, length_band, length_wp, gap_wp):\t\n    s = spring_path(x_1, y_1, dx, x_3, y_3)\n    l = length_band * length_wp / (length_wp + gap_wp)  # l: summierte Laenge aller Werkstuecke im System\n    return (mu * s * k_c * l / a + f_zero) * v_feed\n\t\n\ndef spring_path(x_1, y_1, dx, x_3, y_3):\t# Federweg s\n    alpha = angle(x_1, y_1, dx)\n    return (sqrt(x_3 ** 2 + y_3 ** 2) * cos(alpha) ** 3 * (x_3 - sin(alpha) * sqrt(x_3 ** 2 + y_3 ** 2))) /\\\n            sqrt(x_1 ** 2 + y_1 ** 2 - (x_1 - dx) ** 2)\n\n\ndef angle(x_1, y_1, dx):\n    return atan((x_1 - dx) / sqrt(x_1 ** 2 + y_1 ** 2 - (x_1 - dx) ** 2))\n",
          "doc": "a Abstand Anpressrollen, mu Reibungskoeff. Band, k_c Federkonstante, f_zero Vorspannung Feder,\nv_feed Vorschubgeschw. m/min, x_1, y_1, dx, x_3, y_3, length_band, length_wp, gap_wp"
        },
        {
          "description": "Getriebewerte",
          "func": "from math import pi\n\n\ndef target_func(i_gears, eta, m_nominal, disc_diam, v_feed, process_pow):\n    v_feed_si = v_feed / 60\n    omega = dg(i_gears, v_feed_si, disc_diam)\n    m_process = process_moment(process_pow, omega)\n    m_gr = gear_moment(m_nominal, m_process, eta)\n    gl = gear_loss(m_gr, omega)\n    total_moment = moment_feed_system(m_gr, m_process)\n    return [gl, total_moment, omega, m_process]\n\n\ndef gear_loss(m_gr, omega):\n    return m_gr * omega\n\n\ndef moment_feed_system(m_g, m_process):\t\n    return m_g + m_process\n\n\ndef gear_moment(m_nominal, m_process, eta):\t\t# oben berechnete Prozessleistung muss für m_process durch die Ausgangsdrehzahl des Getriebes geteilt werden, Drehzahl aus Vorschubgeschwindkeit und Durchmesser der Scheibe (ebenfalls als Prozessparameter anzugeben)\n    return (1 - eta) / eta * (0.6 * m_nominal + 0.4 * m_process)\n\n\ndef process_moment(process_pow, omega):\n    return process_pow / omega\n\n\ndef dg(i_gears, v_feed, disc_diam):\n    f = f_abtrieb(v_feed, disc_diam)\n    return i_gears * f\n\n\ndef f_abtrieb(v_feed, d):\n    return v_feed / pi / d\n",
          "doc": "i_gears Uebersetzung Getriebe, eta Getriebewirkungsgrad, m_nominal Nennmoment Getriebe Nm,\ndisc_diam m, v_feed Vorschub m/min, process_pow\nreturns gear_loss, total moment of feed system, (to divide by nominal motor moment for motor loss), omega and process moment"
        }
      ])
    }
  },

  computed: {
    ...mapGetters(['processes']),
    disabledProcess() {
      return this.process.view_name === '' || this.process.api_name === '' || typeof this.process.variant_tree === 'undefined' ||
          !snake.test(this.process.api_name) || this.processes.map(t => t.api_name).includes(this.process.api_name) ||
          this.processes.map(t => t.view_name).includes(this.process.view_name) || this.process.view_name.length > 40 ||
          this.process.api_name.length > 30;
    },
    disabledFunctions() {
      return this.functions.length < 1;
    },
    disabledVariants() {
      return this.variants.length < 1;
    }
  },

  methods: {
    setMaxStep() {
      if (this.max_step < this.def_step) {
        this.max_step = this.def_step;
      }
    },
    continueOne() {
      this.def_step = 2;
      this.setMaxStep();
    },
    continueTwo() {
      this.def_step = 3;
      this.setMaxStep();
    },
    continueThree() {
      this.def_step = this.variants.length > 1
          ? 4
          : 5;
      this.setMaxStep();
    },
    continueFour() {
      this.def_step = 5;
      this.setMaxStep();
    },
    continueFive() {
      this.def_step = 6;
      this.setMaxStep();
    },
    continueSix() {
      let requestData = {
        process: this.process,
        functions: this.functions,
        variants: this.variants,
/*        variants: this.variants.map(v => { return { name: v.name, variant_components: v.variant_components,
          variant_restrictions: v.variant_restrictions,
          variant_functions: v.variant_functions.map(f => { return {position: f.position, is_loss: f.is_loss,
            loss_function_description: f.loss_function_description, variable_name: f.variable_name, description: f.description,
            eval_after_position: f.eval_after_position, aggregate: f.aggregate,
            parameter_list: '(' + f.parameter_list.map(p => p.value).join(', ') + ')'}})
        }; }),*/
        variant_selection: {
          list: this.variant_selection.list,
          tree: this.process.variant_tree ? this.dbTree() : this.variant_selection.tree
        },
        solver: this.solver,
        infoTexts: this.infoTexts
      };
      this.$http.post('processes', requestData).
          then((response) => {
            if (response.status < 400) {
              this.$router.push({ name: 'Process' });
            } else {
              // ToDo: error handling
            }
          }
      ).catch((error) => {
        // ToDo: error handling
      });
      this.def_step = 1;
    },
    abort() {
      this.$router.push({ name: 'Process' });
    },
    jumpStep(val) {
      if (this.max_step >= val && (val !== 4 || this.variants.length > 1)) {
        this.def_step = val;
        this.dialogInfoJump = true;
      }
    },
    dbTree() {
      return {
        question: this.variant_selection.tree[0].question,
        yes: this.treeQuestionBranch(this.variant_selection.tree[0].answers[0]),
        no: this.treeQuestionBranch(this.variant_selection.tree[0].answers[1])
      };
    },
    treeQuestionBranch(node) {
      return {
        excludes: [...node.excludes],
        question: node.question === '' ? null : node.question,
        yes: node.answers.length < 1 ? null : this.treeQuestionBranch(node.answers[0]),
        no: node.answers.length < 1 ? null : this.treeQuestionBranch(node.answers[1])
      };
    }
  }
}
</script>

<style scoped>

</style>