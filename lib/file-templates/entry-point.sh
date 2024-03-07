#!/bin/bash

{{#each ports}}
/home/ssh-tools/kill_port {{this}}
{{/each}}

cd /home/services/{{name}} && {{command}}